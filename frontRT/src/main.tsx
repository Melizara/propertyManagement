//createRoot permet de monter l'appli dans le DOM
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import "bootstrap/dist/css/bootstrap.min.css";//Resaka style Css(couleurs,bouttons...)
import "bootstrap/dist/js/bootstrap.bundle.min";//Resaka dropdowns,modals sns
import { Provider } from 'react-redux';//Rendre le store accessible partout.
import Store from './apps/Store.tsx';//store Redux,endroit ou les données globales sont stockées
import "./App.css";
createRoot(document.getElementById('root')!).render(
  <Provider store={Store}>
    <App />
  </Provider>,
)
 