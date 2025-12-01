import { useEffect } from 'react';
import { socket } from '../socket.js';
import { getCookie } from '../utils/utils.js';
import { notifyError, notifySuccess } from '../utils/toast.js';

export const useSocket = () => {
  useEffect(() => {
    const userId = getCookie('id'); // get user ID from cookie
    if (!userId) return;
    socket.connect(); // connect to backend
    socket.emit('register', userId); // join user room

    // Listen for payment updates
    socket.on('paymentStatus', (data) => {
      if (data.status === 'PAID') {
        notifySuccess(`Payment Successful! Order ID: ${data.orderId}`);
        // Optional: redirect
      } else if (data.status === 'FAILED') {
        notifyError(`Payment Failed! Order ID: ${data.orderId}`);
      }
    });

    return () => {
      socket.off('paymentStatus'); // cleanup listener
      socket.disconnect(); // disconnect on unmount
    };
  }, []);
};
