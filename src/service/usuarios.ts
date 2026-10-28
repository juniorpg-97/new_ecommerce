import { api } from "../lib/axios";

export interface Usuario {
  id: number | string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const respuesta = await api.get<Usuario[]>("/users");
    return respuesta.data;
  },
};
