import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { perfilService, type PerfilFormData } from "../service/perfil";
import { InputFotoPerfil } from "./InputFotoPerfil";

interface PerfilModalProps {
  onClose: () => void;
}

export function PerfilModal({ onClose }: PerfilModalProps) {
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar = useAuthStore((s) => s.usuarioAvatar);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);

  const [fotoArchivo, setFotoArchivo] = useState<File | undefined>();
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorServidor, setErrorServidor] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    defaultValues: { name: usuarioNombre ?? "" },
  });

  const onSubmit = async (data: PerfilFormData) => {
    try {
      setErrorServidor("");
      setMensajeExito("");

      const perfil = await perfilService.actualizar(data, fotoArchivo);

      actualizarPerfil(perfil.name, perfil.avatar_url);

      setMensajeExito("Se actualizo con exito");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setErrorServidor("Error al conectar con el servidor");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/90 p-6 text-zinc-100 shadow-2xl shadow-black/60 backdrop-blur-xl animate-in fade-in zoom-in duration-200 sm:p-8">
        {/* Glow decorativo */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mb-6 flex items-center justify-between">
          <h2 className="font-headline text-xl font-bold tracking-tight text-white">
            Editar Mi Perfil
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 font-bold text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {mensajeExito && (
          <div className="relative mb-6 flex justify-center">
            <div className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-center text-sm font-medium text-blue-300">
              {mensajeExito}
            </div>
          </div>
        )}

        {errorServidor && (
          <div className="relative mb-6 flex justify-center">
            <div className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-medium text-red-300">
              {errorServidor}
            </div>
          </div>
        )}

        <div className="relative mb-6 flex justify-center">
          <InputFotoPerfil
            fotoActual={usuarioAvatar}
            iniciales={(usuarioNombre ?? "").substring(0, 2).toUpperCase()}
            onChange={(file) => setFotoArchivo(file)}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-300">
              Nombre completo
            </label>
            <input
              {...register("name")}
              className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/20"
            />
            {errors.name && (
              <span className="mt-1 block text-xs font-medium text-red-400">
                {errors.name.message}{" "}
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:from-blue-500 hover:to-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
