import React, { useEffect, useState } from 'react';
import api from '../api/users/index';
import { useAuth } from '../authContext';
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


const ModifyDataPage: React.FC = () => {
  const { isAuthenticated, isPasswordEntered, login } = useAuth();
  const [productos, setProductos] = useState<Productos[]>([]);
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  const [selectedImagenId, setSelectedImagenId] = useState<number | null>(null);
  const [formDataProducto, setFormDataProducto] = useState<Productos>({
    id: 0,
    titulo: '',
    category: '',
    description: '',
    es_ingreso: false,
    precio_nuevo: 0,
    precio_viejo: 0,
    codigo_de_barra: '',
  });
  const [formDataImagen, setFormDataImagen] = useState<Imagenes>({
    id: 0,
    imagen_data: '',
    orden: 0,
    codigo_de_barra: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosResponse = await api.get<Productos[]>('/productos/');
        const imagenesResponse = await api.get<Imagenes[]>('/imagen/');
        setProductos(productosResponse.data);
        setImagenes(imagenesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleProductoSelection = (id: number) => {
    const selectedProducto = productos.find(producto => producto.id === id);
    if (selectedProducto) {
      setFormDataProducto(selectedProducto);
      setSelectedProductoId(id);
    }
  };

  const handleImagenSelection = (id: number) => {
    const selectedImagen = imagenes.find(imagen => imagen.id === id);
    if (selectedImagen) {
      setFormDataImagen(selectedImagen);
      setSelectedImagenId(id);
    }
  };

  const handleProductoFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox') {
      // Comprobación de tipo para asegurarse de que el target sea un HTMLInputElement
      if ((event.target as HTMLInputElement).checked !== undefined) {
        newValue = (event.target as HTMLInputElement).checked;
      }
    }
    setFormDataProducto({ ...formDataProducto, [name]: newValue });
  };
  const handleImagenFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormDataImagen({ ...formDataImagen, [name]: value });
  };

  const handleProductoFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.put(`/productos/${selectedProductoId}`, formDataProducto);
      // Update local state
      setProductos(prevProductos =>
        prevProductos.map(producto =>
          producto.id === selectedProductoId ? formDataProducto : producto
        )
      );
    } catch (error) {
      console.error('Error updating producto:', error);
    }
  };

  const handleImagenFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.put(`/imagen/${selectedImagenId}`, formDataImagen);
      // Update local state
      setImagenes(prevImagenes =>
        prevImagenes.map(imagen =>
          imagen.id === selectedImagenId ? formDataImagen : imagen
        )
      );
    } catch (error) {
      console.error('Error updating imagen:', error);
    }
  };

  if (!isAuthenticated || !isPasswordEntered) {
    return <PasswordForm onPasswordSubmit={(password) => login(password)} />;
  }

  return (
    <div className="container mt-5">
      <h1>Modificar Productos</h1>
      <select onChange={(e) => handleProductoSelection(parseInt(e.target.value))}>
        <option value="">Seleccione un producto</option>
        {productos.map(producto => (
          <option key={producto.id} value={producto.id}>{producto.titulo}</option>
        ))}
      </select>
      {selectedProductoId && (
        <form onSubmit={handleProductoFormSubmit}>
          {/* Input fields for product modification */}
        </form>
      )}

      <h1>Modificar Imágenes</h1>
      <select onChange={(e) => handleImagenSelection(parseInt(e.target.value))}>
        <option value="">Seleccione una imagen</option>
        {imagenes.map(imagen => (
          <option key={imagen.id} value={imagen.id}>{imagen.id}</option>
        ))}
      </select>
      {selectedImagenId && (
        <form onSubmit={handleImagenFormSubmit}>
          {/* Input fields for image modification */}
        </form>
      )}
    </div>
  );
};

export default ModifyDataPage;
