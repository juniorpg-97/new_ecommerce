import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";

function StoreMark() {
  return (
    <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-red-500 text-lg font-bold text-white shadow-lg shadow-red-500/30">
      M
    </span>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [errorServidor, setErrorServidor] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      const respuesta = await authService.login(data);

      loginStore(
        respuesta.access_token,
        respuesta.user_name,
        respuesta.user_role,
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-5 py-8 text-zinc-100 sm:px-8">
      {/* Blobs decorativos */}
      <div className="animate-float pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="animate-float pointer-events-none absolute -bottom-40 -right-40 size-[500px] rounded-full bg-red-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* Formulario */}
          <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">
            <div className="w-full max-w-sm">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <StoreMark />
                <span className="font-headline text-xl font-bold tracking-tight">
                  mercado
                </span>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  Bienvenido de vuelta
                </p>
                <h2 className="font-headline text-4xl font-bold tracking-tight text-white">
                  Inicia sesión
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Accede a tu cuenta para ver tus pedidos y favoritos.
                </p>
              </div>

              {errorServidor && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {errorServidor}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <label className="block text-sm font-semibold text-zinc-300">
                  Correo electrónico
                  <input
                    {...register("email")}
                    className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 font-normal text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
                    type="email"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <span className="mt-1 block text-xs font-medium text-red-400">
                      {errors.email.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm font-semibold text-zinc-300">
                  Contraseña
                  <input
                    {...register("password")}
                    className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 font-normal text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <span className="mt-1 block text-xs font-medium text-red-400">
                      {errors.password.message}
                    </span>
                  )}
                </label>

                <div className="flex justify-end">
                  <a
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    href="#forgot-password"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:from-blue-500 hover:to-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-zinc-500">
                ¿Todavía no tienes una cuenta?{" "}
                <a
                  className="font-bold text-blue-400 hover:text-blue-300"
                  href="#register"
                >
                  Regístrate
                </a>
              </p>
            </div>
          </div>

          {/* Panel visual */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-red-600 to-red-700 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0, transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.25) 0, transparent 45%)",
              }}
            />
            <div className="relative flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-white/20 text-lg font-bold text-white backdrop-blur">
                M
              </span>
              <span className="font-headline text-xl font-bold tracking-tight text-white">
                mercado
              </span>
            </div>

            <div className="relative max-w-md">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                Tu tienda, más simple
              </p>
              <h1 className="font-headline text-5xl font-bold leading-[1.05] tracking-tight text-white xl:text-6xl">
                Compra lo que te hace bien.
              </h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-white/80">
                Encuentra productos seleccionados para tu día a día y disfruta
                una experiencia de compra sencilla.
              </p>
            </div>

            <p className="relative text-sm text-white/60">© 2025 mercado</p>
          </div>
        </section>
      </div>
    </main>
  );
}
