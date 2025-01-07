import React, { useEffect, useState } from 'react';
import { getTodaysBills } from '../utils/firebaseFunctions'; // Asegúrate de importar la función
import { motion } from 'framer-motion'; // Asegúrate de tener esta librería para las animaciones
import { IoFastFood } from 'react-icons/io5'; // Para el ícono de comida

const TicketsView = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      const billsData = await getTodaysBills();
      setBills(billsData);
    };

    fetchBills();
  }, []);

  return (
    <section className='w-full my-6' id='menu'>
      <div className='w-full flex flex-col items-center justify-center'>
        <p className='text-2xl font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-orange-400 to-orange-600 transition-all ease-in-out duration-100 mr-auto'>
          Pedidos Pendientes
        </p>

        <div className='w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scrollbar-none'>
          {bills && bills.map((bill, index) => (
            <motion.div
              whileTap={{ scale: 0.75 }}
              key={index}
              className='group bg-white w-24 min-w-[94px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-cartNumBg'
            >
              <div className='w-10 h-10 rounded-full shadow-lg bg-cartNumBg group-hover:bg-card flex items-center justify-center'>
                <IoFastFood className='text-white group-hover:text-textColor text-lg'/>
              </div>
              <p className='text-sm text-textColor group-hover:text-white'>
                Pedido #{index + 1}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TicketsView;
