import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { perfilService } from "../service/perfil";
import { PerfilModal } from "../components/PerfilModal";

function StoreMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-red-500 text-base font-bold text-white shadow-lg shadow-red-500/30">
      M
    </span>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const usuarioNombre = useAuthStore((state) => state.usuarioNombre);
  const usuarioAvatar = useAuthStore((state) => state.usuarioAvatar);
  const actualizarPerfil = useAuthStore((state) => state.actualizarPerfil);
  const esAdmin = useAuthStore((state) => state.esAdmin);

  const [isPerfilOpen, setIsPerfilOpen] = useState(false);

  useEffect(() => {
    perfilService
      .obtener()
      .then((perfil) => actualizarPerfil(perfil.name, perfil.avatar_url))
      .catch(() => {});
  }, [actualizarPerfil]);

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

            {esAdmin() && (
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={() => navigate("/usuarios")}
              >
                Usuarios
              </button>
            )}

            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              type="button"
              onClick={() => setIsPerfilOpen(true)}
            >
              Mi Perfil
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
            Tu cuenta
          </p>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white">
            Hola, {usuarioNombre ?? "Desconocido"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Aquí tienes un resumen de tu actividad en mercado.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-red-600 to-red-700 p-7 text-white md:col-span-2">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
            <p className="relative text-sm font-semibold text-white/70">
              Compra reciente
            </p>
            <h2 className="relative mt-8 font-headline text-2xl font-bold">
              Tu pedido está en camino
            </h2>
            <p className="relative mt-2 text-sm text-white/80">
              Pedido #MK-2048 · Entrega estimada mañana
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
            <p className="text-sm text-zinc-400">Pedidos realizados</p>
            <strong className="mt-8 block font-headline text-4xl font-bold text-white">
              12
            </strong>
            <p className="mt-2 text-xs font-semibold text-red-400">
              +2 este mes
            </p>
          </article>
        </div>
      </div>

      {isPerfilOpen && <PerfilModal onClose={() => setIsPerfilOpen(false)} />}
    </main>
  );
}
