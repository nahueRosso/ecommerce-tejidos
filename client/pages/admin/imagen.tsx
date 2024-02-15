import React, { useEffect, ChangeEvent, useState, FormEvent } from 'react';
import api from '../api/users/index';
import { useAuth } from '../authContext';
import { exists } from 'fs';
import Image from 'next/image';
import { useRouter } from 'next/router';

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

const PasswordForm: React.FC<{ onPasswordSubmit: (password: string) => void }> = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState<string>('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div style={{ margin: '10%' }}>
      <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <label htmlFor="password" style={{ fontSize: '1.2em', fontFamily: 'Montserrat' }} className="form-label">
            Ingrese la contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Ingresar
        </button>
      </form>
    </div>
  );
};


const ImageUploader: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated, isPasswordEntered, login } = useAuth();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [produ, setProdu] = useState<Imagenes[]>([]);
  const [produ2, setProdu2] = useState<Productos[]>([]);
  const [formDataProdu, setFormDataProdu] = useState({
    imagen_data: '',
    orden: 0,
    codigo_de_barra: '',
  });


  const [base64Image, setBase64Image] = useState<string>(''); // Estado para almacenar la imagen en formato Base64
  const [productData, setProductData] = useState<Imagenes[]>([]);

  const fetchImagenes = async () => {
    const response = await api.get<Imagenes[]>('/imagen/');
    setProdu(response.data);
  };

  const fetchProductos = async () => {
    const response = await api.get<Productos[]>('/productos/');
    setProdu2(response.data);
  };

  useEffect(() => {
    fetchProductos();
    fetchImagenes();
  }, []);
console.log()
console.log(produ,produ2)

const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0]; // Obtener la imagen seleccionada
    const reader = new FileReader();

    // Leer la imagen como Base64
    reader.onloadend = () => {
      const base64String = reader.result?.toString() || ''; // Obtener la cadena Base64
      const img = document.createElement('img');
      
      img.src = base64String;
      img.onload = () => {
        console.log('Ancho de la imagen:', img.width);
        console.log('Alto de la imagen:', img.height);
        // if (img.height / img.width === 1.5) {
          setBase64Image(base64String);
        // } else {
        //   setBase64Image('')
        //   alert('La relación de aspecto debe ser 1.5');
        // }
      };
    };

    reader.readAsDataURL(file); 
  }
};




  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
  
    let newValue: string | number = value;

    setFormDataProdu({
      ...formDataProdu,
      [name]: newValue,
    });

  
  };


  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    if(produ2.some(objeto => objeto.codigo_de_barra === `${formDataProdu.codigo_de_barra}`)){
      const formData = {
        imagen_data: base64Image,
        orden: formDataProdu.orden,
        codigo_de_barra: formDataProdu.codigo_de_barra,
      };

      try {
        const response = await api.post('/imagen/', formData);
        console.log('Respuesta del servidor:', response.data);
        fetchImagenes();
        setFormDataProdu({
          imagen_data: '',
          orden: 0,
          codigo_de_barra: '',
        });
        form.reset();

      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }else{
      alert(`${formDataProdu.codigo_de_barra} no pertence a uno de los codigos de barra creados`)
    }
  };

  useEffect(() => {

    
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta transacción?");

    if (confirmDelete) {
      await api.delete(`/imagen/${id}`);
      fetchImagenes();
    }
  };

  const toggleView = () => {
    setShowForm(!showForm);
  };


  if (!isAuthenticated || !isPasswordEntered) {
    return <PasswordForm onPasswordSubmit={(password) => login(password)} />;
  }

  return (
    <div className="container mt-5" style={{overflow:'scroll',height:'100vh',width:'100vw',marginTop:'0',paddingTop:'0'}}>

        <button style={{marginRight:'2em',marginBottom:'1em'}} className="btn btn-success" onClick={() => router.push('admin')}>
        crear / eliminar  productos
      </button>

        <button style={{marginRight:'2em',marginBottom:'1em'}}className="btn btn-success" onClick={() => router.push('put')}>
        modificar  productos / imagenes
      </button>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{showForm ? 'Agregar imagenes' : 'Eliminar imagenes'}</h1>
        <button className="btn btn-primary" onClick={toggleView}>
          {showForm ? 'Eliminar imagenes' : 'Agregar imagenes'}
        </button>
      </div>

      {/* <h1>Subir Imagen</h1> */}
      {showForm ? (
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Seleccione una imagen
          </label>
          <input type="file" className="form-control" id="image" onChange={handleImageChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">
            orden
          </label>
          <input type="number" className="form-control" id="titulo" name="orden" onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            codigo de barra
          </label>
          <input type="text" className="form-control" id="category" name="codigo_de_barra" onChange={handleInputChange} />
        </div>

        <button type="submit" className="btn btn-primary">
          Subir Imagen
        </button>
      </form>):(
        <table className="table">
          <thead>
            <tr>
              <th>imagen</th>
              <th>orden</th>
              <th>codigo de barra</th>
            </tr>
          </thead>
          <tbody>
          {produ
  .slice() // Copia el array para evitar mutaciones no deseadas
  .sort((a, b) => {
    // Compara los códigos de barras y devuelve el resultado de la comparación
    if (a.codigo_de_barra < b.codigo_de_barra) return -1;
    if (a.codigo_de_barra > b.codigo_de_barra) return 1;
    return 0;
  })
  .map((producto) => (
    <tr key={producto.id}>
      <Image src={producto.imagen_data} alt="assa" width={100} height={150} style={{objectFit: "cover"}} />
      <td>{producto.orden}</td>
      <td>{producto.codigo_de_barra}</td>
      <td>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleDelete(producto.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ImageUploader;
