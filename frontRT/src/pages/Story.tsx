import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../apps/Store.tsx";
import axios from "../axios.tsx"
import { deleteStory } from "../features/storySlice.tsx";

function Story() {
  interface StoryType {
    id: number;
    title: string;
    text: string;
    authorId: number;
    author?: {
      username: string;
      email: string;
    };
  }
  interface User {
    id: number;
    name: string;
    email: string;
  }
  const user = useSelector((state: RootState) => state.auth.data) as User | null;
  const { id } = useParams<{ id: string }>();

  const [story, setStory] = useState<StoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/stories/${id}`)
      .then((res) => {
        setStory(res.data); // si res.data est un objet, pas besoin de [0]
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      })
  }, [id]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    if (window.confirm("sure?")) {
      await dispatch(deleteStory(id));
      navigate("/");
    }
  };

  // console.log("user id:", user?.id);
  // console.log("author id:", story?.authorId);

  return (
    <div className="container-lg my-5">
      {loading ? (<div>
        <h3 className="text-secondary fw-bold fs-4">Wait...</h3>
      </div>) :
        (<div className="row text-center justify-content-center">
          <div className="rounded">
            rounded
          </div>
          <h2 className="lead fw-bold mt-5">{story?.title || "Titre indisponible"}</h2>
          {user && user?.id === story?.authorId && (
            <div className="mt-3">
              <div className="d-flex flex-row justify-content-center text-center">
                <div>
                  <Link to={`/update/${story.id}`}>
                    <button className="btn btn-secondary">
                      Edit
                    </button>
                  </Link>
                </div>
                <div>
                  <button className="btn btn-danger ms-2" onClick={() => handleDelete(story.id)}>Delete</button>
                </div>
              </div>
            </div>
          )}
          <p>Auteur : {story?.author?.username || "Inconnu"}</p>
          <p className="text-secondary lead fw-bold mt-2" ><FaEye className="me-2" />Vue par</p>
          <p className="lead mt3">{story?.text || "Texte indisponible"}</p>
        </div>)
      }
    </div>
  )
}

export default Story;