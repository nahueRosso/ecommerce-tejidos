import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../api/users/index';
import Header from '../../components/Header'
import Cart from '../../components/Cart';

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

interface Imagenes {
  id: number;
  imagen_data: string;
  orden: number;
  codigo_de_barra: string;
}

const Productos: React.FC = () => {
  const router = useRouter();
  const { estilo: barcode } = router.query;
  const path = router.asPath;
  const [imagen, setImagen] = useState<Imagenes[]>([]);
  const [producto, setProducto] = useState<Productos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estad

 
 const fetchImagenes = async () => {
    const response = await api.get<Imagenes[]>('/imagen/');
    setImagen(response.data);
  };

  const fetchProductos = async () => {
    const response = await api.get<Productos[]>('/productos/');
    setProducto(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProductos(), fetchImagenes()]);
      setIsLoading(false); // Una vez que se hayan cargado los datos, establece isLoading en false
    };
    
    fetchData();
  }, []);

  // console.log(producto);

  const objetoEncontrado = producto.find(item => item.category === barcode);
  const objetosEncontrados:string[] = producto.filter(item => item.category === barcode).map(objeto => objeto.codigo_de_barra);
  // const imagenesEncontradas = imagen.filter(item => item.codigo_de_barra === barcode);
  
  // imagenesEncontradas.sort((a, b) => a.orden - b.orden);
  
  console.log(objetosEncontrados)


   if (isLoading) {
     return <div className='lazy-bkg' style={{ position: 'absolute', transitionProperty: 'top', top: `0px`, transition: '5s', zIndex: '10000' }}>
     <img src="/logo.png" alt="Descripción de la imagen" width={250} height={250}/></div>;
   }
   

  if (objetoEncontrado) {
   
    return (
      <div>
        <Header api={producto} props={-30} />
        <div style={{width:'100vw',  height:'140px'}}/>
        <div style={{width:'100vw',height:'50px'}} >
        <div style={{ marginLeft:'1em',color: '#868686',fontWeight:'400',fontSize:'20px' }} >{objetosEncontrados.length > 0 ? path.substring(path.lastIndexOf('/') + 1).toUpperCase() : ''} </div>
        </div>
        <div className='estilo-cartas-container'>
        {objetosEncontrados.map((e, index) => (<Cart path={'../productos'} key={index} barcode={e} /> ))}
        </div>
      </div>

    );
  } else {
    console.log('No se encontró ningún objeto con el código de barras especificado.');
    return (
      <div style={{background:'#1a1a1a',width:'100vw',height:'100vh',display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <h2 style={{color:'#e4e4e4'}}>{('Todavía no ha sido creado').toUpperCase() }</h2>
      </div>
    );
  }
};

export default Productos;
