#!/usr/bin/env bash
# Provisions the backend in an AWS Academy Learner Lab account, idempotently:
# run it again after a lab reset and it creates only what is missing.
#
#   S3 bucket        $NAME-profile-2026.2        (profile photos, private)
#   DynamoDB table   $NAME-message-2026.2        (profiles, key: userId)
#   Lambda           $NAME-profile               (aws/lambda/profile)
#   HTTP API         $NAME-api   → GET/PUT /profile, Cognito JWT authorizer
#   Cognito          user pool + Google IdP + hosted domain + public app client
#   Lambda + WS API  $NAME-chatbot / chatBot     (aws/lambda/chatbot, optional)
#
# Usage:  AWS_PROFILE=learner-lab ./aws/deploy.sh
# Reads optional secrets from aws/.secrets.env (gitignored):
#   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET   → Google federation in Cognito
#   GEMINI_API_KEY                           → chatbot Lambda
# Prints the VITE_* values for .env.local / Amplify at the end and writes them
# to aws/.outputs.env.
set -euo pipefail

cd "$(dirname "$0")/.."

NAME="${NAME:-tobiasff}"
GROUP="${GROUP:-feliz}"
REGION="${AWS_REGION:-us-east-1}"
export AWS_REGION="$REGION" AWS_DEFAULT_REGION="$REGION" AWS_PAGER=""

SITE_DOMAIN="$NAME.$GROUP.web.ufersa.dev.br"
BUCKET="$NAME-profile-2026.2"
TABLE="$NAME-message-2026.2"
PROFILE_FN="$NAME-profile"
CHAT_FN="$NAME-chatbot"
HTTP_API_NAME="$NAME-api"
WS_API_NAME="chatBot"
POOL_NAME="$NAME-users"
CLIENT_NAME="AltoTechManager"

[[ -f aws/.secrets.env ]] && set -a && . aws/.secrets.env && set +a

log() { printf '\n\033[1;35m==> %s\033[0m\n' "$*"; }

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/LabRole"
log "Account $ACCOUNT_ID · region $REGION · site https://$SITE_DOMAIN"

BUILD_DIR=$(mktemp -d)
trap 'rm -rf "$BUILD_DIR"' EXIT

zip_lambda() { # $1 source dir → prints zip path
  local out="$BUILD_DIR/$(basename "$1").zip"
  (cd "$1" && zip -qr "$out" .)
  echo "$out"
}

upsert_lambda() { # $1 name, $2 source dir, $3 timeout, $4 env json
  local zip; zip=$(zip_lambda "$2")
  if aws lambda get-function --function-name "$1" >/dev/null 2>&1; then
    aws lambda update-function-code --function-name "$1" --zip-file "fileb://$zip" >/dev/null
    aws lambda wait function-updated --function-name "$1"
    aws lambda update-function-configuration --function-name "$1" \
      --timeout "$3" --environment "$4" >/dev/null
  else
    aws lambda create-function --function-name "$1" --runtime nodejs22.x \
      --role "$ROLE_ARN" --handler index.handler --timeout "$3" --memory-size 256 \
      --zip-file "fileb://$zip" --environment "$4" >/dev/null
  fi
  aws lambda wait function-updated --function-name "$1" 2>/dev/null ||
    aws lambda wait function-active --function-name "$1"
}

allow_apigw() { # $1 function, $2 api id, $3 statement id
  aws lambda add-permission --function-name "$1" --statement-id "$3" \
    --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$2/*" >/dev/null 2>&1 || true
}

# --- S3 -------------------------------------------------------------------
log "S3 bucket $BUCKET"
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" >/dev/null
fi
aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# --- DynamoDB -------------------------------------------------------------
log "DynamoDB table $TABLE"
if ! aws dynamodb describe-table --table-name "$TABLE" >/dev/null 2>&1; then
  aws dynamodb create-table --table-name "$TABLE" \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST >/dev/null
  aws dynamodb wait table-exists --table-name "$TABLE"
fi

# --- Cognito --------------------------------------------------------------
log "Cognito user pool $POOL_NAME"
POOL_ID=$(aws cognito-idp list-user-pools --max-results 60 \
  --query "UserPools[?Name=='$POOL_NAME'].Id | [0]" --output text)
if [[ "$POOL_ID" == "None" || -z "$POOL_ID" ]]; then
  POOL_ID=$(aws cognito-idp create-user-pool --pool-name "$POOL_NAME" \
    --username-attributes email --auto-verified-attributes email \
    --schema Name=ejId,AttributeDataType=String,Mutable=true \
    --policies 'PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}' \
    --query UserPool.Id --output text)
fi

DOMAIN_PREFIX="$NAME-$(echo "$ACCOUNT_ID" | tail -c 7)"
if [[ "$(aws cognito-idp describe-user-pool --user-pool-id "$POOL_ID" --query UserPool.Domain --output text)" == "None" ]]; then
  aws cognito-idp create-user-pool-domain --user-pool-id "$POOL_ID" --domain "$DOMAIN_PREFIX" >/dev/null
fi
COGNITO_DOMAIN="$(aws cognito-idp describe-user-pool --user-pool-id "$POOL_ID" --query UserPool.Domain --output text).auth.$REGION.amazoncognito.com"

PROVIDERS=(COGNITO)
if [[ -n "${GOOGLE_CLIENT_ID:-}" && -n "${GOOGLE_CLIENT_SECRET:-}" ]]; then
  log "Google identity provider"
  GOOGLE_DETAILS="client_id=$GOOGLE_CLIENT_ID,client_secret=$GOOGLE_CLIENT_SECRET,authorize_scopes=openid email profile"
  MAPPING='email=email,name=name,picture=picture,username=sub,email_verified=email_verified'
  if aws cognito-idp describe-identity-provider --user-pool-id "$POOL_ID" --provider-name Google >/dev/null 2>&1; then
    aws cognito-idp update-identity-provider --user-pool-id "$POOL_ID" --provider-name Google \
      --provider-details "$GOOGLE_DETAILS" --attribute-mapping "$MAPPING" >/dev/null
  else
    aws cognito-idp create-identity-provider --user-pool-id "$POOL_ID" --provider-name Google \
      --provider-type Google --provider-details "$GOOGLE_DETAILS" --attribute-mapping "$MAPPING" >/dev/null
  fi
  PROVIDERS+=(Google)
else
  echo "   (GOOGLE_CLIENT_ID/SECRET not set — skipping Google federation)"
fi

CALLBACKS=("https://$SITE_DOMAIN/login/callback" "http://localhost:5173/login/callback")
LOGOUTS=("https://$SITE_DOMAIN/login" "http://localhost:5173/login")
if [[ -n "${AMPLIFY_DEFAULT_DOMAIN:-}" ]]; then
  CALLBACKS+=("https://$AMPLIFY_DEFAULT_DOMAIN/login/callback")
  LOGOUTS+=("https://$AMPLIFY_DEFAULT_DOMAIN/login")
fi
CLIENT_ARGS=(--user-pool-id "$POOL_ID"
  --explicit-auth-flows ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH
  --supported-identity-providers "${PROVIDERS[@]}"
  --callback-urls "${CALLBACKS[@]}" --logout-urls "${LOGOUTS[@]}"
  --allowed-o-auth-flows code --allowed-o-auth-scopes openid email profile
  --allowed-o-auth-flows-user-pool-client
  --read-attributes email email_verified name picture custom:ejId
  --prevent-user-existence-errors ENABLED)
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "$POOL_ID" \
  --query "UserPoolClients[?ClientName=='$CLIENT_NAME'].ClientId | [0]" --output text)
if [[ "$CLIENT_ID" == "None" || -z "$CLIENT_ID" ]]; then
  CLIENT_ID=$(aws cognito-idp create-user-pool-client --client-name "$CLIENT_NAME" \
    --no-generate-secret "${CLIENT_ARGS[@]}" --query UserPoolClient.ClientId --output text)
else
  aws cognito-idp update-user-pool-client --client-id "$CLIENT_ID" --client-name "$CLIENT_NAME" \
    "${CLIENT_ARGS[@]}" >/dev/null
fi
ISSUER="https://cognito-idp.$REGION.amazonaws.com/$POOL_ID"

# --- Profile Lambda + HTTP API -------------------------------------------
log "Lambda $PROFILE_FN"
upsert_lambda "$PROFILE_FN" aws/lambda/profile 15 \
  "{\"Variables\":{\"PROFILE_TABLE\":\"$TABLE\",\"PROFILE_BUCKET\":\"$BUCKET\"}}"
PROFILE_ARN=$(aws lambda get-function --function-name "$PROFILE_FN" --query Configuration.FunctionArn --output text)

log "HTTP API $HTTP_API_NAME"
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='$HTTP_API_NAME'].ApiId | [0]" --output text)
CORS='AllowOrigins=*,AllowMethods=GET,PUT,OPTIONS,AllowHeaders=authorization,content-type,MaxAge=3600'
if [[ "$API_ID" == "None" || -z "$API_ID" ]]; then
  API_ID=$(aws apigatewayv2 create-api --name "$HTTP_API_NAME" --protocol-type HTTP \
    --cors-configuration "$CORS" --query ApiId --output text)
else
  aws apigatewayv2 update-api --api-id "$API_ID" --cors-configuration "$CORS" >/dev/null
fi

AUTH_ID=$(aws apigatewayv2 get-authorizers --api-id "$API_ID" \
  --query "Items[?Name=='cognito'].AuthorizerId | [0]" --output text)
JWT_CFG="Audience=$CLIENT_ID,Issuer=$ISSUER"
if [[ "$AUTH_ID" == "None" || -z "$AUTH_ID" ]]; then
  AUTH_ID=$(aws apigatewayv2 create-authorizer --api-id "$API_ID" --name cognito \
    --authorizer-type JWT --identity-source '$request.header.Authorization' \
    --jwt-configuration "$JWT_CFG" --query AuthorizerId --output text)
else
  aws apigatewayv2 update-authorizer --api-id "$API_ID" --authorizer-id "$AUTH_ID" \
    --jwt-configuration "$JWT_CFG" >/dev/null
fi

INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id "$API_ID" \
  --query "Items[?IntegrationUri=='$PROFILE_ARN'].IntegrationId | [0]" --output text)
if [[ "$INTEGRATION_ID" == "None" || -z "$INTEGRATION_ID" ]]; then
  INTEGRATION_ID=$(aws apigatewayv2 create-integration --api-id "$API_ID" \
    --integration-type AWS_PROXY --integration-uri "$PROFILE_ARN" \
    --payload-format-version 2.0 --query IntegrationId --output text)
fi

for ROUTE in "GET /profile" "PUT /profile"; do
  if [[ "$(aws apigatewayv2 get-routes --api-id "$API_ID" --query "Items[?RouteKey=='$ROUTE'].RouteId | [0]" --output text)" == "None" ]]; then
    aws apigatewayv2 create-route --api-id "$API_ID" --route-key "$ROUTE" \
      --target "integrations/$INTEGRATION_ID" --authorization-type JWT \
      --authorizer-id "$AUTH_ID" >/dev/null
  fi
done

if ! aws apigatewayv2 get-stage --api-id "$API_ID" --stage-name '$default' >/dev/null 2>&1; then
  aws apigatewayv2 create-stage --api-id "$API_ID" --stage-name '$default' --auto-deploy >/dev/null
fi
allow_apigw "$PROFILE_FN" "$API_ID" "apigw-profile"
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com"

# --- Chatbot (optional) ---------------------------------------------------
CHAT_URL=""
if [[ -n "${GEMINI_API_KEY:-}" ]]; then
  log "Lambda $CHAT_FN + WebSocket API $WS_API_NAME"
  CHAT_ENV=$(printf '{"Variables":{"GEMINI_API_KEY":"%s","COGNITO_USER_POOL_ID":"%s","COGNITO_CLIENT_ID":"%s"}}' \
    "$GEMINI_API_KEY" "$POOL_ID" "$CLIENT_ID")
  upsert_lambda "$CHAT_FN" aws/lambda/chatbot 60 "$CHAT_ENV"
  CHAT_ARN=$(aws lambda get-function --function-name "$CHAT_FN" --query Configuration.FunctionArn --output text)

  WS_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='$WS_API_NAME'].ApiId | [0]" --output text)
  if [[ "$WS_ID" == "None" || -z "$WS_ID" ]]; then
    WS_ID=$(aws apigatewayv2 create-api --name "$WS_API_NAME" --protocol-type WEBSOCKET \
      --route-selection-expression '$request.body.action' --query ApiId --output text)
  fi
  WS_INT=$(aws apigatewayv2 get-integrations --api-id "$WS_ID" \
    --query "Items[0].IntegrationId" --output text)
  if [[ "$WS_INT" == "None" || -z "$WS_INT" ]]; then
    WS_INT=$(aws apigatewayv2 create-integration --api-id "$WS_ID" --integration-type AWS_PROXY \
      --integration-uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$CHAT_ARN/invocations" \
      --query IntegrationId --output text)
  fi
  for ROUTE in '$connect' '$disconnect' '$default' 'sendMessage'; do
    if [[ "$(aws apigatewayv2 get-routes --api-id "$WS_ID" --query "Items[?RouteKey=='$ROUTE'].RouteId | [0]" --output text)" == "None" ]]; then
      aws apigatewayv2 create-route --api-id "$WS_ID" --route-key "$ROUTE" \
        --target "integrations/$WS_INT" >/dev/null
    fi
  done
  if ! aws apigatewayv2 get-stage --api-id "$WS_ID" --stage-name dev >/dev/null 2>&1; then
    aws apigatewayv2 create-stage --api-id "$WS_ID" --stage-name dev --auto-deploy >/dev/null
  else
    aws apigatewayv2 create-deployment --api-id "$WS_ID" --stage-name dev >/dev/null
  fi
  allow_apigw "$CHAT_FN" "$WS_ID" "apigw-chatbot"
  CHAT_URL="wss://$WS_ID.execute-api.$REGION.amazonaws.com/dev"
else
  echo "   (GEMINI_API_KEY not set — skipping the chatbot)"
fi

# --- Outputs --------------------------------------------------------------
cat > aws/.outputs.env <<EOF
VITE_DATA_SOURCE=mock
VITE_AUTH_SOURCE=cognito
VITE_AWS_REGION=$REGION
VITE_API_URL=$API_URL
VITE_CHAT_WS_URL=$CHAT_URL
VITE_COGNITO_USER_POOL_ID=$POOL_ID
VITE_COGNITO_CLIENT_ID=$CLIENT_ID
VITE_COGNITO_DOMAIN=$COGNITO_DOMAIN
EOF
log "Done. Frontend variables (also in aws/.outputs.env):"
cat aws/.outputs.env
echo
echo "Google OAuth client → Authorized redirect URI: https://$COGNITO_DOMAIN/oauth2/idpresponse"
