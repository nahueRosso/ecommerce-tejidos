import React, { useEffect, useState } from 'react';
import api from './api/users/index';
import Image from 'next/image';

interface Productos {
  id : number;
  titulo : string;
  category : string;
  description : string;
  es_ingreso : boolean;
  precio_nuevo : number;
  precio_viejo : number;
  codigo_de_barra : string;
  }

const App: React.FC = () => {
  
  const [produ, setProdu] = useState<Productos[]>([]);
  const [formDataProdu, setFormDataProdu] = useState({
    titulo: '',
    category: '',
    description: '',
    es_ingreso: false,
    precio_nuevo: 0,
    precio_viejo:0,
    codigo_de_barra:'',
  });

  const fetchProductos = async () => {
    const response = await api.get<Productos[]>('/productos/');
    setProdu(response.data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
  < >
  <Image 
    src='/assets/lo.png' 
    alt=''
    width={500} 
    height={750} 
    fill={false}
    style={{objectFit: "cover"}}
   />
</>

    );
};




export default App;

// import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import api from './api/users/index';

// // interface Transaction {
// //   id: number;
// //   amount: string;
// //   category: string;
// //   description: string;
// //   is_income: boolean;
// //   date: string;
// // }
// interface Productos {
//   id : number;
//   titulo : string;
//   category : string;
//   description : string;
//   es_ingreso : boolean;
//   precio_nuevo : number;
//   precio_viejo : number;
//   codigo_de_barra : string;
//   }

// const App: React.FC = () => {
//   // const [transactions, setTransactions] = useState<Transaction[]>([]);
//   // const [formData, setFormData] = useState({
//   //   amount: '',
//   //   category: '',
//   //   description: '',
//   //   is_income: false,
//   //   date: '',
//   // });
  
//   const [produ, setProdu] = useState<Productos[]>([]);
//   const [formDataProdu, setFormDataProdu] = useState({
//     titulo: '',
//     category: '',
//     description: '',
//     es_ingreso: false,
//     precio_nuevo: 0,
//     precio_viejo:0,
//     codigo_de_barra:'',
//   });

//   // const fetchTransactions = async () => {
//   //   const response = await api.get<Transaction[]>('/transaction/');
//   //   setTransactions(response.data);
//   // };

//   // useEffect(() => {
//   //   fetchTransactions();
//   // }, [])
//   ;
//   const fetchProductos = async () => {
//     const response = await api.get<Productos[]>('/productos/');
//     setProdu(response.data);
//   };

//   useEffect(() => {
//     fetchProductos();
//   }, []);

//   // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
//   //   const value =
//   //     event.target.type === 'checkbox' ? event.target.checked : event.target.value;
//   //   setFormData({
//   //     ...formData,
//   //     [event.target.name]: value,
//   //   });
//   // };

//   // const handleFormSubmit = async (event: FormEvent) => {
//   //   event.preventDefault();
//   //   await api.post('/transaction/', formData);
//   //   fetchTransactions();
//   //   setFormData({
//   //     amount: '',
//   //     category: '',
//   //     description: '',
//   //     is_income: false,
//   //     date: '',
//   //   });
//   // };

//   // const handleDelete = async (id: number) => {
//   //   const confirmDelete = window.confirm("¿Estás seguro de eliminar esta transacción?");
  
//   //   if (confirmDelete) {
//   //     await api.delete(`/transaction/${id}`);
//   //     fetchTransactions();
//   //   }
//   // };

//   // console.log(transactions)
//   console.log(produ)

//   return (
//   <div className="container mt-5">
//   {/* <h1>Formulario</h1>
//   <form onSubmit={handleFormSubmit}>
//     <div className="mb-3">
//       <label htmlFor="amount" className="form-label">
//         Monto
//       </label>
//       <input
//         type="number"
//         className="form-control"
//         id="amount"
//         name="amount"
//         value={formData.amount}
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className="mb-3">
//       <label htmlFor="category" className="form-label">
//         Categoría
//       </label>
//       <input
//         type="text"
//         className="form-control"
//         id="category"
//         name="category"
//         value={formData.category}
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className="mb-3">
//       <label htmlFor="description" className="form-label">
//         Descripción
//       </label>
//       <input
//         type="text"
//         className="form-control"
//         id="description"
//         name="description"
//         value={formData.description}
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className="mb-3">
//       <label htmlFor="date" className="form-label">
//         Fecha
//       </label>
//       <input
//         type="text"
//         className="form-control"
//         id="date"
//         name="date"
//         value={formData.date}
//         onChange={handleInputChange}
//       />
//     </div>
//     <div className="mb-3 form-check">
//       <input
//         type="checkbox"
//         className="form-check-input"
//         id="is_income"
//         name="is_income"
//         checked={formData.is_income}
//         onChange={handleInputChange}
//       />
//       <label className="form-check-label" htmlFor="is_income">
//         Es ingreso
//       </label>
//     </div>
//     <button type="submit" className="btn btn-primary">
//       Enviar
//     </button>
//   </form>

//   <h1>Transacciones</h1>
//   <table className="table">
//         <thead>
//           <tr>
//             <th>Amount</th>
//             <th>Category</th>
//             <th>Description</th>
//             <th>Income?</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction) => (
//             <tr key={transaction.id}>
//               <td>{transaction.amount}</td>
//               <td>{transaction.category}</td>
//               <td>{transaction.description}</td>
//               <td>{transaction.is_income ? 'yes' : 'no'}</td>
//               <td>{transaction.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>


//       <h1>Transacciones delates</h1>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Amount</th>
//             <th>Category</th> 
//             <th>Description</th>
//             <th>Income?</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction) => (
//             <tr key={transaction.id}>
//               <td>{transaction.amount}</td>
//               <td>{transaction.category}</td>
//               <td>{transaction.description}</td>
//               <td>{transaction.is_income ? 'yes' : 'no'}</td>
//               <td>{transaction.date}</td>
//               <td>
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={() => handleDelete(transaction.id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>       */}
// </div>

//     );
// };




// export default App;

