import { FaEye } from "react-icons/fa";

function Story() {
  return (
    <div className="container-lg my-5">
      <div className="row text-center justify-content-center">
        <div className="rounded">
          rounded
        </div>
        <h2 className="lead fw-bold mt-5">Title</h2>
        <div className="mt3">
          <div className="d-flex flex-row justify-content-center text-center">
            <div>
              <button className="btn btn-secondary">Edit</button>
            </div>
            <div>
              <button className="btn btn-danger ms-2">Delete</button>
            </div>
          </div>
        </div>
        <h4 className="text-primary lead fw-bold mt-5">pub by Melizara</h4>
        <p className="text-sexondary lead fw-bold mt-2" ><FaEye className="me-2"/>Vue par</p>
        <p className="lead mt3">sdhfwjelhjehgjehhr</p>
      </div>
    </div>
  )
}

export default Story;