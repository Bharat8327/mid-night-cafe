import { useEffect } from 'react';
import { socket } from '../socket.js';
import { getCookie } from '../utils/utils.js';

export const useSocket = () => {
  useEffect(() => {
    const userId = getCookie('id'); // get user ID from cookie
    console.log(userId);

    if (!userId) return;

    socket.connect(); // connect to backend
    socket.emit('register', userId); // join user room

    // Listen for payment updates
    socket.on('paymentStatus', (data) => {
      if (data.status === 'PAID') {
        alert(`✅ Payment Successful! Order ID: ${data.orderId}`);
        // Optional: redirect
      } else if (data.status === 'FAILED') {
        alert(`❌ Payment Failed! Order ID: ${data.orderId}`);
      }
    });

    return () => {
      socket.off('paymentStatus'); // cleanup listener
      socket.disconnect(); // disconnect on unmount
    };
  }, []);
};
