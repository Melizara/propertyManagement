function Write(){
  return(
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
        <form>
          <div className="mb-5 rounded">
              <input type="text" placeholder="title" className="form-control" required />
          </div>
          <div className="mb-3 rounded">
              <input type="text" placeholder="Story" className="form-control" required />
          </div>
          <div className="mb-3 rounded">
              <input type="text" placeholder="Sary " className="form-control" />
          </div>
          <div className="mb-3 rounded">
              <button type="submit" className="btn btn-primary">Publish</button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default Write;