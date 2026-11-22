import { PageHeader } from "@/components/layout";
import {
  Avatar,
  AvatarField,
  Button,
  Card,
  CardTitle,
  Note,
  Spinner,
  TextAreaField,
  TextField,
} from "@/components/ui";
import { useProfilePage } from "./hooks";

/**
 * The signed-in user's own profile: data in DynamoDB, picture in S3, both
 * written through PUT /profile on API Gateway.
 */
const ProfilePage: React.FC = () => {
  const page = useProfilePage();
  const { user, form, setField, profile, save } = page;
  const stored = profile.data;

  return (
    <>
      <PageHeader
        title="Meu perfil"
        description="Seus dados cadastrais e sua foto. A foto fica guardada no S3 e os dados no DynamoDB — e pode ser diferente da que veio da sua conta Google."
      />

      {!page.configured && (
        <Note className="mb-6">
          A API de perfil ainda não está configurada (VITE_API_URL).
        </Note>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardTitle>Informações cadastradas</CardTitle>

          {profile.isLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Avatar
                  name={stored?.name || user?.name || "?"}
                  src={stored?.photo ?? user?.providerAvatarUrl}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="m-0 truncate font-display text-md font-bold">
                    {stored?.name || user?.name}
                  </p>
                  <p className="m-0 truncate text-sm text-tinta-suave">
                    {stored?.email || user?.email}
                  </p>
                </div>
              </div>

              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-tinta-suave">Telefone</dt>
                <dd className="m-0">{stored?.phone || "—"}</dd>
                <dt className="text-tinta-suave">Curso</dt>
                <dd className="m-0">{stored?.course || "—"}</dd>
                <dt className="text-tinta-suave">Sobre</dt>
                <dd className="m-0 whitespace-pre-line">{stored?.bio || "—"}</dd>
                <dt className="text-tinta-suave">Foto no S3</dt>
                <dd className="m-0 break-all font-mono text-2xs">
                  {stored?.photoKey ?? "—"}
                </dd>
                <dt className="text-tinta-suave">Atualizado em</dt>
                <dd className="m-0">
                  {stored?.updatedAt
                    ? new Date(stored.updatedAt).toLocaleString("pt-BR")
                    : "—"}
                </dd>
              </dl>

              {user?.providerAvatarUrl && (
                <div className="flex items-center gap-3 rounded-md border border-linha bg-papel px-3 py-2.5">
                  <Avatar
                    name={user.name}
                    src={user.providerAvatarUrl}
                    size="sm"
                  />
                  <p className="m-0 text-xs text-tinta-suave">
                    Foto vinda da autenticação federada (Google).
                  </p>
                </div>
              )}

              {profile.isError && (
                <p className="m-0 text-sm text-ambar">
                  {profile.error instanceof Error
                    ? profile.error.message
                    : "Não foi possível carregar o perfil."}
                </p>
              )}
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Editar perfil</CardTitle>

          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <AvatarField
              label="Foto do perfil"
              name={form.name}
              value={page.photo}
              onChange={page.setPhoto}
            />
            <TextField
              label="Nome"
              required
              maxLength={120}
              value={form.name}
              onChange={(event) => setField("name")(event.target.value)}
            />
            <TextField
              label="E-mail"
              type="email"
              maxLength={160}
              value={form.email}
              onChange={(event) => setField("email")(event.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Telefone"
                type="tel"
                maxLength={30}
                value={form.phone}
                onChange={(event) => setField("phone")(event.target.value)}
              />
              <TextField
                label="Curso"
                maxLength={120}
                value={form.course}
                onChange={(event) => setField("course")(event.target.value)}
              />
            </div>
            <TextAreaField
              label="Sobre você"
              maxLength={600}
              value={form.bio}
              onChange={(event) => setField("bio")(event.target.value)}
            />

            <div>
              <Button
                type="submit"
                disabled={!page.configured || save.isPending || !form.name.trim()}
              >
                {save.isPending ? "Salvando…" : "Salvar perfil"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export { ProfilePage };
