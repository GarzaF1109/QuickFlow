import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import NotFound from '../img/NotFound.svg';
import { FaPencilAlt } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { editItem } from '../utils/firebaseFunctions';

function RowContainerEdit({ flag, data, scrollValue }) {
  const rowContainer = useRef();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', price: '', calories: '' });
  const [notification, setNotification] = useState(null); // Estado para notificaciones
  const [{ cartItems }, dispatch] = useStateValue();

//   const addToCart = () => {
//     dispatch({
//       type: actionType.SET_CART_ITEMS,
//       cartItems: items,
//     });
//     localStorage.setItem('cartItems', JSON.stringify(items));
//   };

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);

//   useEffect(() => {
//     addToCart();
//   }, [items]);

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setFormValues({
      title: item.title,
      price: item.price,
      calories: item.calories,
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmEdit = async () => {
    const updatedItem = { ...itemToEdit, ...formValues };
    try {
      await editItem(itemToEdit.id, updatedItem);
      const updatedItems = cartItems.map((cartItem) =>
        cartItem.id === itemToEdit.id ? updatedItem : cartItem
      );
      setItems(updatedItems);
      setNotification({ success: true, message: "Edición realizada con éxito" });
    } catch (error) {
      console.error('Error al editar el item:', error);
      setNotification({ success: false, message: "Error al editar el ítem" });
    } finally {
      setShowModal(false);
      setTimeout(() => {
        setNotification(null); // Desaparece la notificación después de 3 segundos
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
                onClick={() => handleEditClick(item)}
              >
                <FaPencilAlt className="text-white" />
              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end">
              <p className="text-textColor font-semibold text-base md:text-lg">
                {item?.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {item?.calories} Calories
              </p>
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
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 max-w-lg">
            <p className="text-lg font-semibold mb-4 text-center sm:text-left">
              Edit Item: {itemToEdit?.title}
            </p>
            <div className="flex flex-col gap-4">
              <p className='font-semibold'>Title</p>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
                placeholder="Título"
              />
              <p className='font-semibold'>Price</p>
              <input
                type="text"
                name="price"
                value={formValues.price}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
                placeholder="Precio"
              />
              <p className='font-semibold'>Calories</p>
              <input
                type="text"
                name="calories"
                value={formValues.calories}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
                placeholder="Calorías"
              />
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
                onClick={handleConfirmEdit}
              >
                Update
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {notification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className={`fixed top-10 right-10 z-50 flex items-center gap-4 p-4 rounded shadow-md  ${
            notification.success ? 'bg-green-500' : 'bg-red-500'
          } text-white font-semibold`}
        >
          {notification.success ? <FaRegCircleCheck className="mr-2" /> : <MdErrorOutline className="mr-2" />}
          <p>{notification.message}</p>
        </motion.div>
      )}
    </div>
  );
}

export default RowContainerEdit;
