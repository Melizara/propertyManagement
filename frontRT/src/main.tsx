//createRoot permet de monter l'appli dans le DOM
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
//Resaka style Css(couleurs,bouttons...)
import "bootstrap/dist/css/bootstrap.min.css"
//Resaka dropdowns,modals sns
import "bootstrap/dist/js/bootstrap.bundle.min"
//Rendre le store accessible partout.
import { Provider } from 'react-redux'
//store Redux,endroit ou les données globales sont stockées
import Store from './apps/Store.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={Store}>
    <App />
  </Provider>,
)
 