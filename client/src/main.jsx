import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { Toaster } from 'react-hot-toast';
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      {/* <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      > */}
      <App />
      {/* </GoogleReCaptchaProvider> */}
      <Toaster position="bottom-left" reverseOrder={false} />
    </Provider>
  </BrowserRouter>,
);
