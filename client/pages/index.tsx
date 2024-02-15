import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import api from "./api/users/index";
import Link from 'next/link';
import Header from '../components/Header'
import Carrusel from "../components/Carrusel";
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

const Index: React.FC = () => {
  
  const mainRef = useRef<HTMLDivElement>(null);
  const hiddenHeaderRef = useRef<HTMLUListElement>(null);
  const prevScrollY = useRef(0);

 const [visible, setVisible] = useState(true);
  const [apiDataReceived, setApiDataReceived] = useState(false);
  const [numero, setNumero] = useState<string>('block')
  const [carruselTop,setCarruselTop] = useState<number>(0)

  const [imagen, setImagen] = useState<Imagenes[]>([]);
  const [producto, setProducto] = useState<Productos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setIsLoading(false);
      setApiDataReceived(true) // Una vez que se hayan cargado los datos, establece isLoading en false
    };
    
    fetchData();

  }, []);

  useEffect(() => {
    if (apiDataReceived) {
      const intervalId = setInterval(() => {
        setVisible((prevVisible) => !prevVisible);
      }, visible ? 1000 : 500);

      return () => clearInterval(intervalId);
    }
  }, [visible, numero]);

  // if (apiDataReceived ) {
  //   // setTimeout(() => { setNumero(e => e = e + 1) }, 0.01);
  //    setNumero(e => e = 'none') ;
  // }

  // if (apiDataReceived === true) {
  //   const body = mainRef.current?.parentElement?.parentElement;
  //   if (body) {
  //     body.style.overflowY = 'auto';
  //   }
  // }

  useEffect(() => {
    const handleBeforeUnload = () => window.scrollTo(0, 0);
    window.onbeforeunload = handleBeforeUnload;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);


//scroll y -up -down  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY.current) {
        setCarruselTop(e=>e=-30)
        console.log('Desplazamiento hacia abajo');
      } else if (currentScrollY < prevScrollY.current) {
        setCarruselTop(e=>e=0)
        console.log('Desplazamiento hacia arriba');
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleMouseOver = () => {
    hiddenHeaderRef.current.style.visibility = 'visible';
    hiddenHeaderRef.current.style.opacity = '1';
    // hiddenHeaderRef.current.style.background = 'black';
  };
  
  const handleMouseOut = () => {
    hiddenHeaderRef.current.style.visibility = 'hidden';
    hiddenHeaderRef.current.style.opacity = '0';
    // hiddenHeaderRef.current.style.background = 'yellow';
  };

      // useEffect(()=>{
      //   setTimeout(() => { setNumero(e => e = e + 1) }, 1);
  
      // },[isLoading])

  return (
    <div className='contain-main' ref={mainRef}>
    {<div className='lazy-bkg' style={{ position: 'absolute', transitionProperty: 'top', top: `0`, display: `${apiDataReceived?'none':'flex'}`,opacity:`${apiDataReceived?'0':'1'} `, transition: '5s', zIndex: '10000' }}>
      {visible && (
        <Image
          src="/logo.png"
          alt="Descripción de la imagen"
          width={250}
          height={250}
          
        />
      )}
    </div>}

      {/* {(apiDataReceived === true )  && ( */}
      <div>
        <div className='carrusel-oferta' style={{top:`${carruselTop}px`}}>
          <h5>SUMMMMER SALE! - 3 CUOTAS SIN INTERÉS & 6 CUOTAS SIN INTERÉS EN COMPRAS MAYORES A $80.000 </h5>
        </div>

        <Header api={producto} props={carruselTop} />
       
        <div style={{ width: '100vw', height: '104.235vw', position: 'relative' }}>
          <Image
            src="/main.png"
            alt="Descripción de la imagen"
            layout="fill"
            objectFit="cover"
            style={{objectFit: "cover"}}
          />
        </div>
      </div>
      <Carrusel path={'/productos'}array={producto.map(e=>e.codigo_de_barra).slice(0,5)}/>
      <Carrusel path={'/productos'}array={producto.map(e=>e.codigo_de_barra).slice(5,10)}/>
    </div>
  );
};

export default Index;
