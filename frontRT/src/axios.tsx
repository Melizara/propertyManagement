//Ilaina ity code ty mba ialana @ oe iantso anle axios erakin'ny Appli.
//Karazana instance personaliser anle axios
import axios from "axios";

//Eto ilay creation anle instace mba ialana anle fanoratana an'io any am code rehetra any
const instance=axios.create({
    baseURL:"http://localhost:5000"
});

//Ity no antsoina we intercepteur
//Antsoin'ny axios io rehefa andefa requete izy na avy mandray reponse
instance.interceptors.request.use((config)=>{
    //Eto zao mi-recuperer ny token stoké ao @ navigateur
    config.headers.Authorization = window.localStorage.getItem("token");
    return config
});

export default instance;