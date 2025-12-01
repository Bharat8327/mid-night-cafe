import toast from 'react-hot-toast';

export const notifySuccess = (msg) => {
  toast.success(msg, {
    duration: 3000,
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const notifyError = (msg) => {
  toast.error(msg, {
    duration: 3000,
    style: {
      borderRadius: '10px',
      background: '#ff4d4f',
      color: '#fff',
    },
  });
};

export const notifyInfo = (msg) => {
  toast(msg, {
    duration: 2500,
  });
};
