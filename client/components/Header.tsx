import React, { useState, useRef} from 'react';
import Image from 'next/image';
// import api from "./api/users/index";
import Link from 'next/link';


interface Props {
    props:number;
    api:any[];
  }

const Header: React.FC<Props> = ({api,props=0}) => {
    
  const [carruselTop,setCarruselTop] = useState<number>(0)
    const hiddenHeaderRef = useRef<HTMLUListElement>(null);

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
    
      const arrayCategorias:string[] = api.map((e,i)=>e.category).filter((e,i,s)=>{
        return s.indexOf(e) === i
      })
      // const arrayRaro2:string[] = arrayRaro.

      // console.log(arrayRaro)

      console.log(arrayCategorias)

  return (
<div className='header' onMouseLeave={handleMouseOut} style={{top:`${props + 30}px`}}>
          <div className='header-top'>
            
            <div className='header-top-icono-1'>
              <Image
              src="/icon-search.svg"
              alt="lupa"
              width={30}
              height={30}
              />
            </div>
            
            <Image
            src="/nombre-alpha.png"
            alt="Descripción de la imagen"
            width={(1508*65)/474}
            height={65}
            />
          
            <div className='header-top-icono-2'></div>
          
          </div>
          <ul className='header-bottom' >
        <li>
          <Link href="/">
            INICIO
          </Link>
        </li>

        <li
          className='ofertas-hidden'
          onMouseEnter ={handleMouseOver}
        >
           
      
          <Link href="/">
            OFERTAS
          </Link>
          <Image
            src='/arrow-down.svg'
            alt=''
            width={14}
            height={14}
          />
        </li>

        <li>
          <Link href="/newin">
            NUEVO
          </Link>
        </li>
      </ul>

      <ul className='header-hidden'  ref={hiddenHeaderRef}>
  {arrayCategorias.map((e,i) => (
    <li key={i}>
      <Link href={'/estilos/' + e}>
        {e.toUpperCase()}
      </Link>
    </li>
  ))}
</ul>  


        </div>  )
}

export default Header
