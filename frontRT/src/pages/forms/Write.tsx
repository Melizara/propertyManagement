import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import type { RootState } from "../../apps/Store.tsx";
import type { FormEvent } from "react";
import { toast } from "react-toastify";

function Write() {
  //Recuperation des infos de l'utilisateur dans le store Redux.
  const user = useSelector((state: RootState) => state.auth.data);

  //Ces deux hoooks sert a creer des etats locaux pour stocker le titre et contenu du texte que l'utilisateur saisie
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  //recuperer le id depuis l'URL
  const { id } = useParams();
  const isUpdate = Boolean(id);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`/api/stories/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [id]); // <-- important


  if (!user && !window.localStorage.getItem("token")) {
    toast.success("You should login first !");
    return <Navigate to="/login" />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isUpdate) {
        await axios.put(`/api/stories/${id}`, { title, text })
      } else {
        await axios.post("/api/stories", { title, text })
      }
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div className="container-lg my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center">
            <h2 className="fw-bold mb-5">
              Write a story
            </h2>
          </div>
        </div>
      </div>

      <div className="row justify-content-center text-center">
        <form onSubmit={handleSubmit} encType="multipart/form-data" >
          <div className="mb-5 rounded">
            <input type="text" placeholder="title" className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 rounded">
            <input type="text" placeholder="Story" className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 rounded">
            <input type="text" placeholder="Sary " className="form-control" />
          </div>
          {loading ? <div className="mb-3 rounded">Publishing...</div> : (
            <div className="mb-3 rounded">
              <button type="submit" className="btn btn-primary">Publish</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
};

export default Write;