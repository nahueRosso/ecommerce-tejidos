// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number;
  name: string;
};

export type Productos = {
  id : number;
  titulo : string;
  category : string;
  description : string;
  es_ingreso : boolean;
  precio_nuevo : number;
  precio_viejo : number;
  codigo_de_barra : string;
  }
