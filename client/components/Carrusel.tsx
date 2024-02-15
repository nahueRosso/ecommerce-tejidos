import React, { useState, useRef } from 'react';
import Cart from './Cart';
import Image from 'next/image';

interface Array {
  array: string[];
  path:string
}

const Carrusel: React.FC<Array> = ({ path,array }) => {

  const [contador,setContador] = useState<number>(0)
  const largo_de_array:number = - 418 * array.length
  const [left, setLeft] = useState<number>(largo_de_array);

  const container = useRef<HTMLDivElement>(null);

  const moveRight = () => {
    if (container.current && contador < array.length - 2) {
      // Resto 2 en lugar de 3
      const newLeft = left - (array.length * (382 + 18 * 2) / 3);
      setLeft(newLeft);
      container.current.style.left = `${newLeft}px`;
      setContador(contador + 1);
    }else if (container.current) {
      const newLeft = 0 - (array.length * (382 + 18 * 2) / 3);
      setLeft(newLeft);
      container.current.style.left = `${newLeft}px`;
      setContador(1);
    }
  };
  
  const moveLeft = () => {
    if (container.current && contador > 0) {
      const newLeft = left + (array.length * (382 + 18 * 2) / 3);
      setLeft(newLeft);
      container.current.style.transition = `left 1s`;
      container.current.style.left = `${newLeft}px`;
      setContador(contador - 1); // Decrementar el contador
    }else if (container.current) {
      const newLeft = -2090 +(array.length * (382 + 18 * 2) / 3);
      setLeft(newLeft);
      container.current.style.left = `${newLeft}px`;
      setContador(2); // Decrementar el contador
    }
  }; 

    return (
    <div style={{ width: '100%', height: '684px', position: 'relative' }}>
      <button onClick={moveLeft} className='arrow-left' style={{border:'none',background:'transparent', width: '100px', height: '684px', position: 'absolute', zIndex: '10000', top: '0', left: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src='/arrow-left.svg' alt='' width={80} height={80} />
      </button>
      <div ref={container} style={{ transition: 'left 1s', display: 'flex', position: 'absolute', left: `${left}px` }}>
        {array.map((e, index) => (<Cart path={path} key={index} barcode={e} /> ))}
        {array.map((e, index) => (<Cart path={path} key={index} barcode={e} /> ))}
        {array.map((e, index) => (<Cart path={path} key={index} barcode={e} /> ))}
      </div>
      <button className='arrow-right' onClick={moveRight} style={{ border:'none',background:'transparent',width: '100px', height: '684px', position: 'absolute', zIndex: '10000', top: '0', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src='/arrow-right.svg' alt='' width={80} height={80} />
      </button>
    </div>
  );
};

export default Carrusel;
