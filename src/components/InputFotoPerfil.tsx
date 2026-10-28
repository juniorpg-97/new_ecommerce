import { useEffect, useState } from "react";

interface Props {
  fotoActual?: string | null;
  iniciales: string;
  onChange: (file: File | undefined) => void;
}

export function InputFotoPerfil({ fotoActual, iniciales, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande, no debe superar los 5MB");
      return;
    }
    setPreview(URL.createObjectURL(file));

    onChange(file);
  };

  const quitarSeleccion = () => {
    setPreview(null);
    onChange(undefined);
  };

  const imagenMostrada = preview ?? fotoActual;

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="group relative inline-block cursor-pointer">
        {/* Aro con gradiente azul → rojo */}
        <div className="rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-red-600 p-[3px] shadow-lg shadow-red-500/20 transition group-hover:shadow-red-500/40">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
            {imagenMostrada ? (
              <img
                src={imagenMostrada}
                alt="Avatar de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-to-br from-blue-600/20 to-red-600/20 text-2xl font-bold text-white">
                {iniciales}
              </span>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <span className="text-xs font-semibold text-white">
                Cambiar foto
              </span>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {preview && (
        <button
          type="button"
          onClick={quitarSeleccion}
          className="text-xs font-semibold text-red-400 transition hover:text-red-300"
        >
          Quitar foto
        </button>
      )}
    </div>
  );
}
