import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { TamañoDeImagen } from "../function/first";
import Image from 'next/image';
import api from '../pages/api/users/index'

interface CartProps {
  barcode:string;
  path:string;
}

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


const Cart: React.FC<CartProps> = ({ path,barcode}) => {
  const [newImage, setNewImage] = useState<string>(''); // Estado para la nueva imagen
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
console.log()
// console.log(producto,imagen)

// Filtrar el producto por código de barras
const productoFiltrado = producto.find((prod) => prod.codigo_de_barra === barcode);

// Filtrar la imagen por código de barras y encontrar la de menor número de orden
const imagenFiltrada = imagen.filter((img) => img.codigo_de_barra === barcode)
  .sort((a, b) => a.orden - b.orden)[0]; // Ordenar por orden ascendente y tomar el primero

// Si no se encuentra ningún producto o imagen con el código de barras dado, retornar null
if (!productoFiltrado || !imagenFiltrada) {
// if (!productoFiltrado || !imagenFiltrada) {
  return null;
}




 

  const numeroFormateadoNewPrice = productoFiltrado.precio_nuevo.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numeroFormateadoNewOldPrice = productoFiltrado.precio_viejo.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });



  return (
    <>
      <Link href={path +'/'+ barcode} className='cart-container'>
        <div className='cart-image-container'>
          <Image
            src={imagenFiltrada.imagen_data}
            alt=''
            width={382}
            height={573}
            style={{objectFit: "cover"}}
          />
          <div className='cart-oferta-box' style={0===(productoFiltrado.precio_viejo)?{display:'none'}:{}} >
            {Math.round( 100-((productoFiltrado.precio_nuevo)*100/productoFiltrado.precio_viejo))}% OFF
          </div>
        </div>
        <div className='cart-bottom'>
          <div className='cart-bottom-titule'>{productoFiltrado.titulo.toUpperCase()}</div>
          <div className='cart-bottom-prices'>
            <h5 className='cart-opcional-old-price' style={0===(productoFiltrado.precio_viejo)?{display:'none'}:{}}>
              ${numeroFormateadoNewOldPrice}
            </h5>
            <h5>${numeroFormateadoNewPrice}</h5>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Cart;
