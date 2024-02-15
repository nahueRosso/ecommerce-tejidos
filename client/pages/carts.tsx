import React,{useState,useEffect} from 'react'
import Cart from '../components/Cart'
import Carrusel from "../components/Carrusel";
import api from "./api/users/index";


interface Imagenes {
  id: number;
  imagen_data: string;
  orden: number;
  codigo_de_barra: string;
}

interface Productos {
  id: number;
  titulo: string;
  category: string;
  description: string;
  es_ingreso: boolean;
  precio_nuevo: number;
  precio_viejo: number;
  codigo_de_barra: string;
}

const carts = () => {
  const [imagen, setImagen] = useState<Imagenes[]>([]);
    const [producto, setProducto] = useState<Productos[]>([]);

    const fetchImagenes = async () => {
        const response = await api.get<Imagenes[]>('/imagen/');
        setImagen(response.data);
      };
    
      const fetchProductos = async () => {
        const response = await api.get<Productos[]>('/productos/');
        setProducto(response.data);
      };
    
      useEffect(() => {
        fetchProductos();
        fetchImagenes();
      }, []);


      const bufandas = producto.filter(item => item.category === 'bufandas');

      const barCodeBufandas = bufandas.map(item => item.codigo_de_barra);

      console.log(barCodeBufandas)

  return (
    <div style={{display:'flex'}}>
      

    <Carrusel array={barCodeBufandas}/>
    </div>
  )
}

export default carts
