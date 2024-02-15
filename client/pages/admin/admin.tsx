import React, { useEffect, ChangeEvent, useState, FormEvent } from 'react';
import api from '../api/users/index';
import { useAuth } from '../authContext';
import { useRouter } from 'next/router';
import { exists } from 'fs';

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

const AdminPage: React.FC = () => {
  const router = useRouter()
  const { isAuthenticated, isPasswordEntered, login } = useAuth();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [produ, setProdu] = useState<Productos[]>([]);
  const [formDataProdu, setFormDataProdu] = useState({
    titulo: '',
    category: '',
    description: '',
    es_ingreso: true,
    precio_nuevo: 0,
    precio_viejo: 0,
    codigo_de_barra: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const fetchProductos = async () => {
    const response = await api.get<Productos[]>('/productos/');
    setProdu(response.data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value, type } = event.target;
  
    let newValue: string | boolean = value;
    if (type === 'checkbox') {
      newValue = (event.target as HTMLInputElement).checked;
    }
  
    setFormDataProdu({
      ...formDataProdu,
      [name]: newValue,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
  const form = event.target as HTMLFormElement;

  // Validar si la categoría está vacía
  if (!formDataProdu.category) {
    alert('Por favor elija una categoría LCDTM');
    return; // Detener el envío del formulario
  }

    if(!produ.some(objeto => objeto.codigo_de_barra === `${formDataProdu.codigo_de_barra}`)){  
      const formData = {
        titulo: formDataProdu.titulo,
        category: formDataProdu.category,
        description: formDataProdu.description,
        es_ingreso: formDataProdu.es_ingreso,
        precio_nuevo: formDataProdu.precio_nuevo,
        precio_viejo: formDataProdu.precio_viejo,
        codigo_de_barra: formDataProdu.codigo_de_barra,
      };
      
      try {
        const response = await api.post('/productos/', formData);
        console.log('Respuesta del servidor:', response.data);
        fetchProductos();
        setFormDataProdu({
          titulo: '',
          category: '',
          description: '',
          es_ingreso: false,
          precio_nuevo: 0,
          precio_viejo: 0,
          codigo_de_barra: '',
        });
        form.reset();
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }else{alert(`el codigo de barra "${formDataProdu.codigo_de_barra}" ya fue creado`)}
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta transacción?");

    if (confirmDelete) {
      await api.delete(`/productos/${id}`);
      fetchProductos();
    }
  };

  const toggleView = () => {
    setShowForm(!showForm);
  };

  if (!isAuthenticated || !isPasswordEntered) {
    return <PasswordForm onPasswordSubmit={(password) => login(password)} />;
  }

  console.log(produ)

  return (
    <div className="container mt-5" style={{overflow:'scroll',height:'100vh',width:'100vw',marginTop:'0',paddingTop:'0'}}>

        <button  style={{marginRight:'2em',marginBottom:'1em'}} className="btn btn-success" onClick={() => router.push('imagen')}>
        agregar / eliminar imagenes
      </button>
      <button style={{marginRight:'2em',marginBottom:'1em'}} className="btn btn-success" onClick={() => router.push('put')}>
        modificar  productos / imagenes
      </button>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>{showForm ? 'Agragar producto' : 'Eliminar producto'}</h1>
        <button className="btn btn-primary" onClick={toggleView}>
          {showForm ? 'Eliminar Producto' : 'Agregar Producto'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="form-control"
              id="titulo"
              name="titulo"
              value={formDataProdu.titulo}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Categoría
            </label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formDataProdu.category}
              onChange={handleInputChange}
            >
              <option value="">elegirrrr</option>
              <option value="sweaters">SWEATERS</option>
              <option value="calados">CALADOS</option>
              <option value="bordados">BORDADOS</option>
              <option value="sacos">SACOS</option>
              <option value="ruanas_ponchos">RUANAS & PONCHOS</option>
              <option value="vestidos">VESTIDOS</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={formDataProdu.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="codigo_de_barra" className="form-label">
              Código de Barra
            </label>
            <input
              type="text"
              className="form-control"
              id="codigo_de_barra"
              name="codigo_de_barra"
              value={formDataProdu.codigo_de_barra}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio_nuevo" className="form-label">
              Precio Nuevo
            </label>
            <input
              type="number"
              className="form-control"
              id="precio_nuevo"
              name="precio_nuevo"
              value={formDataProdu.precio_nuevo}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio_viejo" className="form-label">
              Precio Viejo
            </label>
            <input
              type="number"
              className="form-control"
              id="precio_viejo"
              name="precio_viejo"
              value={formDataProdu.precio_viejo}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="es_ingreso"
              name="es_ingreso"
              checked={formDataProdu.es_ingreso}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="es_ingreso">
              En Stock
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Código de Barra</th>
              <th>Precio Nuevo</th>
              <th>Precio Viejo</th>
              <th>En Stock</th>
              <th>Acciones</th>
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
      <td>{producto.titulo}</td>
      <td>{producto.category}</td>
      <td>{(producto.description).length > 30 ? `${producto.description.slice(0, 30)}...` : producto.description}</td>
      <td>{producto.codigo_de_barra}</td>
      <td>{producto.precio_nuevo}</td>
      <td>{producto.precio_viejo}</td>
      <td>{producto.es_ingreso ? 'Sí' : 'No'}</td>
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

export default AdminPage;
