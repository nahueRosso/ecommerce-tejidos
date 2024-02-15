export async function TamañoDeImagen(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
  
        if (typeof width === 'number' && typeof height === 'number') {
          resolve({ width, height });
        } else {
          reject(new Error('Las dimensiones no son del tipo number.'));
        }
      };
  
      img.onerror = (error) => {
        reject(error);
      };
  
      img.src = url;
    });
  }
  