import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { usuariosService, type Usuario } from "../service/usuarios";

function StoreMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-red-500 text-base font-bold text-white shadow-lg shadow-red-500/30">
      M
    </span>
  );
}

export function UsuariosPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const usuarioNombre = useAuthStore((state) => state.usuarioNombre);
  const usuarioAvatar = useAuthStore((state) => state.usuarioAvatar);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    usuariosService
      .listar()
      .then((data) => setUsuarios(data))
      .catch(() => setError("Error al cargar la lista de usuarios"))
      .finally(() => setCargando(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[400px] rounded-full bg-red-600/15 blur-[120px]" />

      <header className="relative border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <StoreMark />
            <span className="font-headline text-lg font-bold tracking-tight">
              mercado
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            {usuarioAvatar ? (
              <img
                src={usuarioAvatar}
                alt="Foto de perfil"
                className="size-10 rounded-full object-cover ring-2 ring-red-500/40"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-blue-500/20 text-xs text-blue-300 ring-1 ring-blue-500/30">
                {usuarioNombre
                  ? usuarioNombre.substring(0, 2).toUpperCase()
                  : "NN"}
              </span>
            )}
            <span className="hidden text-zinc-300 sm:block">
              {usuarioNombre ?? "Usuario Desconocido"}
            </span>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="text-xs font-semibold text-zinc-500 transition hover:text-red-400"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Administración
          </p>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white">
            Usuarios
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Lista completa de clientes y administradores registrados.
          </p>
        </div>

        {cargando && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400 backdrop-blur">
            Cargando usuarios...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Usuario</th>
                    <th className="px-6 py-4 font-semibold">Correo</th>
                    <th className="px-6 py-4 font-semibold">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="transition hover:bg-white/[0.03]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.name}
                              className="size-10 rounded-full object-cover ring-2 ring-red-500/30"
                            />
                          ) : (
                            <span className="grid size-10 place-items-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 ring-1 ring-blue-500/30">
                              {u.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span className="font-semibold text-white">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            u.role.toLowerCase() === "admin"
                              ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
                              : "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
