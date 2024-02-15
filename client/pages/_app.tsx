import { AuthProvider } from './authContext';
import '../styles/main.css';
import '../styles/cart.css';
import '../styles/producto.css';
import '../styles/estilo.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
