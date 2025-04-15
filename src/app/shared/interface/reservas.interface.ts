export interface Reservas {
  id: number;
  id_user: string;
  id_espacio: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  precio: number;
  created_at: string;
  updated_at: string;

  espacio: {
    id: number;
    nombre: string;
  };

  usuario: {
    id: number;
    name: string;
  };
}
