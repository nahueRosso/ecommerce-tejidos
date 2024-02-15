import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../api/users/index';
import Header from '../../components/Header';
import Image from 'next/image'; 
import Carrusel from '../../components/Carrusel';

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
  const [clickedDiv, setClickedDiv] = useState<string>('');
  const divRef = useRef<HTMLDivElement>();
  const router = useRouter();
  const { producto: barcode } = router.query;
  
  const [imagen, setImagen] = useState<Imagenes[]>([]);
  const [producto, setProducto] = useState<Productos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para controlar la carga de la información de la API
  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
const [screenHeight, setScreenHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

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

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Se ejecuta cuando el componente se desmonta para limpiar el evento
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

   // Efecto para manejar el cambio de ruta
   useEffect(() => {
    // Dentro del useEffect para manejar el cambio de ruta
const handleRouteChange = (url) => {
  console.log('Ruta cambiada:', url);
  // Verificar si hay imágenes encontradas y al menos una imagen antes de acceder a ella
  if (imagenesEncontradas.length > 0) {
    setClickedDiv(imagenesEncontradas[0].imagen_data);
  }
};

router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  const objetoEncontrado = producto.find(item => item.codigo_de_barra === barcode);
  const imagenesEncontradas = imagen.filter(item => item.codigo_de_barra === barcode);
  
  imagenesEncontradas.sort((a, b) => a.orden - b.orden);
  
  useEffect(() => {
    if (imagenesEncontradas.length > 0) {
      setClickedDiv(imagenesEncontradas[0].imagen_data);
    }
  }, [isLoading]);

  if (isLoading) {
    return <div className='lazy-bkg' style={{ position: 'absolute', transitionProperty: 'top', top: `0px`, transition: '5s', zIndex: '10000' }}>
    <img src="/logo.png" alt="Descripción de la imagen" width={250} height={250}/></div>;
  }
  
  if (objetoEncontrado) {
    console.log('Objeto encontrado:', objetoEncontrado);
    console.log('Imagen encontrada:', imagenesEncontradas);
    
    const handleDivClick = (divName) => {
      // Manejador de evento para cuando se hace clic en un div
      console.log(`Se hizo clic en el code ${divName}`);
      // Puedes hacer lo que quieras con los datos aquí, como enviarlos a un servidor, etc.
      setClickedDiv(divName); // Actualiza el estado para almacenar el div clicado
    };

    const numeroFormateadoNewPrice = objetoEncontrado.precio_nuevo.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  
    const numeroFormateadoNewOldPrice = objetoEncontrado.precio_viejo.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  

    

    return (
      <div ref={divRef}>
        <div className='header-hidden-bkg-withe' />
        <Header api={producto} props={-30} />
        <div className='imagen-detalle-container'>
          <div className='imagen-sobrantes'>
            {imagenesEncontradas.slice(0, 5).map((e,i) => (
              <div className={'imagenes-chiquitas imgagen-chica-' + i } key={i} onClick={() => handleDivClick(e.imagen_data)} style={{ borderRadius:'1em', width: `${screenWidth * .1}px`, height: `${screenWidth * .15}px`}} >
                <Image
                  style={{borderRadius:'1em',objectFit: "cover"}}
                  src={e.imagen_data}
                  alt=''
                  width={screenWidth * .1}
                  height={screenWidth * .15}  
                />
              </div>
            ))}
          </div>
          <div className='imagen'>
          <div className='cart-oferta-box producto-cart-oferta-box' style={0===(objetoEncontrado.precio_viejo)?{display:'none'}:{}} >
            {Math.round( 100 - ((objetoEncontrado.precio_nuevo)*100/objetoEncontrado.precio_viejo))}% OFF
          </div>
            <Image
              style={{objectFit: "cover",borderRadius:'1em'}}
              src={clickedDiv}
              alt=''
              width={screenWidth * 0.55}
              height={screenWidth * 0.825}
            />
          </div>
          <div className='producto-detalle-container'>
            <div className='producto-categoria'>{objetoEncontrado.category.toUpperCase()}</div>
            <div className='producto-titulo'>{objetoEncontrado.titulo.toUpperCase()}</div>
            <div className='producto-precio'>
              <h5 className='cart-opcional-old-price' style={0===(objetoEncontrado.precio_viejo)?{display:'none'}:{}}>
                ${numeroFormateadoNewOldPrice}
              </h5>
              <h5>${numeroFormateadoNewPrice}</h5>
            </div>
            <div className='producto-descripcion' >{objetoEncontrado.description.toUpperCase()}</div>
          </div>
        </div>
        <div style={{width:'100vw',height:'50px'}}/>
        <Carrusel path={'/productos'} array={producto.map(e=>e.codigo_de_barra).slice(0,5)}/>
      </div>
    );
  } else {
    console.log('No se encontró ningún objeto con el código de barras especificado.');
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Todavía no ha sido creado</h2>
      </div>
    );
  }
};

export default Productos;
