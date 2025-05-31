import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import NotFound from '../img/NotFound.svg';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import Person from '../img/persondoubt.png';
import { deleteItem } from "../utils/firebaseFunctions";

function RowContainerDelete({ flag, data, scrollValue }) {
  const rowContainer = useRef();
  const [items, setitems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState(null); // Estado para manejar notificaciones
  const [{ cartItems }, dispatch] = useStateValue();

  // const addtocart = () => {
  //   dispatch({
  //     type: actionType.SET_CART_ITEMS,
  //     cartItems: items,
  //   });
  //   localStorage.setItem("cartItems", JSON.stringify(items));
  // };

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);

  // useEffect(() => {
  //   addtocart();
  // }, [items]);

  const handleDelete = async () => {
    try {
      if (itemToDelete?.id) {
        await deleteItem(itemToDelete.id); // Eliminar de Firebase
        setitems(cartItems.filter((item) => item.id !== itemToDelete.id)); // Actualizar estado local
        setNotification({ success: true, message: "Successfully Deleted" });
      }
    } catch (error) {
      console.error("Error al eliminar el item: ", error);
      setNotification({ success: false, message: "Process failed" });
    } finally {
      setShowModal(false);
      setItemToDelete(null);
      setTimeout(() => {
        setNotification(null); // Desaparece la notificación después de 1.5 segundos
        if (notification?.success) {
          window.location.reload(); // Refrescar la página si el proceso fue exitoso
        }
      }, 3000);
    }
  };

  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center gap-3 my-12 scroll-smooth ${
        flag
          ? 'overflow-x-scroll scrollbar-none'
          : 'overflow-x-hidden flex-wrap justify-center'
      }`}
    >
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item?.id}
            className="w-275 h-[175px] min-w-[275px] md:w-300 md:min-w-[300px] bg-cardOverlay rounded-lg py-2 px-4 my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src={item?.imageUrl}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center cursor-pointer hover:shadow-md"
                onClick={() => {
                  setItemToDelete(item); // Guardar el item a eliminar
                  setShowModal(true); // Mostrar el modal de confirmación
                }}
              >
                <IoCloseSharp className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end">
              <p className="text-textColor font-semibold text-base md:text-lg">
                {item?.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">{item?.calories} Calories</p>
              <div className="flex items-center gap-8">
                <p className="text-lg text-headingColor font-semibold">
                  <span className="text-sm text-red-500">$</span>
                  {item?.price}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} className="h-340" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Items Not Available
          </p>
        </div>
      )}

      {showModal && (
        <motion.div  initial={{opacity : 0, scale : 0.6}} animate={{opacity : 1, scale : 1}} exit={{opacity : 0, scale : 0.6}} 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 max-w-lg">
            <p className="text-lg font-semibold mb-4 text-center sm:text-left">
              Are you sure that you want to eliminate de following item?
            </p>
            <div className="flex justify-center items-center my-1.5">
              <img className="w-4/5 sm:w-3/5 translate-x-[-5px] sm:translate-x-[-10px]" src={Person} alt="Person" />
            </div>
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
                onClick={handleDelete}
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {notification && (
        <motion.div initial={{opacity : 0.5, scale : 0.7}} animate={{opacity : 1, scale : 1}} exit={{opacity : 0, scale : 0.6}} className={`fixed top-10 right-10 z-50 flex items-center gap-4 p-4 rounded shadow-md ${
          notification.success ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {notification.success ? (
            <FaRegCircleCheck className="text-white text-2xl" />
          ) : (
            <MdErrorOutline className="text-white text-2xl" />
          )}
          <p className="text-white font-semibold">{notification.message}</p>
        </motion.div>
      )}
    </div>
  );
}

export default RowContainerDelete;
