export interface PreguntaPayload {
  pregunta: string;
  opciones: string[];
  opcionesCorrectas: number[];
  categorias: string[];
  explicacion: string;
  imagenBase64?: string;
}
