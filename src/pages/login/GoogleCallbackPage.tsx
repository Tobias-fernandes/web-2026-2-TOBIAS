import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { completeGoogleSignIn } from "@/auth/services";
import { Brand } from "@/components/layout";
import { ErrorText, Spinner } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { useAdoptSession } from "@/stores/auth";
import { toast } from "@/stores/toast";

/**
 * Where Cognito returns the reader after Google: trades the one-time code in
 * the URL for a session, then moves on to wherever the sign-in started from.
 */
const GoogleCallbackPage: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const adopt = useAdoptSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    completeGoogleSignIn(search)
      .then(({ session, redirectTo }) => {
        if (cancelled) return;
        adopt(session);
        toast.success(`Bem-vindo(a), ${session.user.name.split(" ")[0]}!`);
        navigate(redirectTo, { replace: true });
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível entrar com Google.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [search, adopt, navigate]);

  return (
    <div className="grid min-h-dvh place-items-center bg-papel px-6 py-16">
      <div className="flex w-full max-w-90 flex-col items-center gap-6 text-center">
        <Brand to={ROUTES.landing} className="justify-center" />
        {error ? (
          <>
            <ErrorText>{error}</ErrorText>
            <Link to={ROUTES.login} replace className="text-sm">
              Voltar para o login
            </Link>
          </>
        ) : (
          <Spinner label="Entrando com Google…" />
        )}
      </div>
    </div>
  );
};

export { GoogleCallbackPage };
