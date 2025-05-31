import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdShoppingBasket } from 'react-icons/md';
import NotFound from '../img/NotFound.svg';
import { getTodaysBills } from '../utils/firebaseFunctions';

const TicketsView = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const billsData = await getTodaysBills();
        setBills(billsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bills: ', error);
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-start my-12">
      {loading ? (
        <p className="text-lg text-headingColor font-semibold">Loading...</p>
      ) : bills.length > 0 ? (
        bills.map((bill, index) => (
          <div
            key={index}
            className="w-full h-auto bg-cardOverlay rounded-lg py-4 px-6 mb-4 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-start justify-between relative"
          >
            <h2 className="text-lg font-bold text-headingColor">
              CUENTA ID: {bill.userId}
            </h2>
            <p className="text-sm text-gray-600">
              Timestamp: {new Date(bill.timestamp.seconds * 1000).toLocaleString()}
            </p>
            <div className="w-full mt-4 columns-2">
              {bill.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.qty} | ${item.price}
                      </p>
                    </div>
                  </div>
                  <MdShoppingBasket className="text-gray-500 text-lg" />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} alt="Not Found" className="h-340" />
          <p className="text-xl text-headingColor font-semibold my-2">
            No orders per today
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketsView;
