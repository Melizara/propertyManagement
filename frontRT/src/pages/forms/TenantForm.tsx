import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import type { RootState } from "../../apps/Store.tsx";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { RefreshCcw, Save } from "lucide-react";


function TenantForm() {
  //Recuperation des infos de l'utilisateur dans le store Redux.
  const user = useSelector((state: RootState) => state.auth.data);
  //Ces deux hoooks sert a creer des etats locaux pour stocker le titre et contenu du texte que l'utilisateur saisie
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cin, setCin] = useState("");
  const [cinPlace, setCinPlace] = useState("");
  const [dateCin, setDateCin] = useState("");
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [address, setAddress] = useState("");
  const [neighborHood, setNeighborHood] = useState("");
  const [municipality, setMunicipality] = useState("");
  const { cin: cinParam } = useParams<{ cin: string }>(); //recuperer le id depuis l'URL
  const isUpdate = Boolean(cinParam);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [birthDateError, setBirthDateError] = useState("");
  const [dateCinError, setDateCinError] = useState("");
  const [cinError, setCinError] = useState("");

  useEffect(() => {
    if (cinParam) {
      axios.get(`/api/tenants/${cinParam}`)
        .then(({ data }) => {
          setName(data.name);
          setLastName(data.lastName);
          setBirthDate(data.birthDate);
          setBirthPlace(data.birthPlace);
          setCin(data.cin);
          setCinPlace(data.cinPlace);
          setDateCin(data.dateCin);
          setFather(data.father);
          setMother(data.mother);
          setAddress(data.address);
          setNeighborHood(data.neighborHood);
          setMunicipality(data.municipality);
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [cinParam]); // <-- important

  if (!user && !window.localStorage.getItem("token")) return <Navigate to="/login" />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setBirthDateError("");
      setDateCinError("");
      setCinError("");
      const tenantData = {
        name,
        lastName,
        birthPlace,
        birthDate: birthDate ? new Date(birthDate).toISOString() : null,
        cin,
        cinPlace,
        dateCin: dateCin ? new Date(dateCin).toISOString() : null,
        father,
        mother,
        address,
        neighborHood,
        municipality,
        userMatricule: user?.matricule
      };
      if (isUpdate) {
        await axios.put(`/api/tenants/${cinParam}`, tenantData);

        toast.success("Locataire modifié avec succès !");
      } else {
        await axios.post("/api/tenants", tenantData);
        toast.success("Locataire ajouté avec succès !");
      }
      navigate("/tenant")
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response && axiosError.response.status === 400) {
        const errorMessage = axiosError.response.data?.error || "Erreur";
        if (errorMessage.includes("majeur")) {
          setBirthDateError(errorMessage);
        } else if (errorMessage.includes("plus")) {
          setDateCinError(errorMessage);
        } else if (errorMessage.includes("chiffres")) {
          setCinError(errorMessage);
        }
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container-lg" style={{ marginTop: "-225px" }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb py-2 px-3 rounded-3">
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
              Accueil
            </Link>
          </li>
          <span className="mx-2 mt-1">{" > "}</span>
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/tenant" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
              Locataires
            </Link>
          </li>

          {cin && (
            <>
              <span className="mx-2 mt-1">{" > "}</span>
              <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
                <Link to={`/tenant/${cin}`} className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
                  Information du locataire
                </Link>
              </li>
            </>
          )}

          <span className="mx-2 mt-1">{" > "}</span>
          <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
            Formulaire du locataire
          </li>
        </ol>
      </nav>
      <div className="mb-4 text-center">
        <p className="fs-5 text-secondary">
          Veuillez remplir le formulaire ci-dessous correctement.
        </p>
      </div>

      {/* Formulaire dans une Card */}
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Nom et Prénom */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" value={name}
                  maxLength={50}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setName(lettersOnly);
                  }} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prénom</label>
                <input type="text" className="form-control" value={lastName}
                  maxLength={70}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setLastName(lettersOnly);
                  }} required />
              </div>
            </div>

            {/* Date et lieu de naissance */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Date de naissance</label>
                {birthDateError && <div className="text-danger mb-1">{birthDateError}</div>}
                <input type="date" className="form-control" value={birthDate}
                  onChange={e => setBirthDate(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Lieu de naissance</label>
                <input type="text" className="form-control" value={birthPlace}
                  maxLength={50}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setBirthPlace(lettersOnly);
                  }} required />
              </div>
            </div>

            {/* CIN */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">CIN</label>
                {cinError && <div className="text-danger mb-1">{cinError}</div>}
                <input
                  type="text"
                  className="form-control"
                  value={cin}
                  maxLength={12} // limite à 12 caractères
                  onChange={e => {
                    // On ne garde que les chiffres
                    let numbersOnly = e.target.value.replace(/\D/g, "");
                    // On limite à 12 chiffres
                    if (numbersOnly.length > 12) {
                      numbersOnly = numbersOnly.slice(0, 12);
                    }
                    setCin(numbersOnly);
                  }}
                  placeholder="Entrez 12 chiffres"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Lieu du CIN</label>
                <input type="text" className="form-control" value={cinPlace}
                  maxLength={50}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setCinPlace(lettersOnly);
                  }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date du CIN</label>
                {dateCinError && <div className="text-danger mb-1">{dateCinError}</div>}
                <input type="date" className="form-control" value={dateCin}
                  onChange={e => setDateCin(e.target.value)} required />
              </div>
            </div>

            {/* Parents */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Père</label>
                <input type="text" className="form-control" value={father}
                  maxLength={70}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setFather(lettersOnly);
                  }} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mère</label>
                <input type="text" className="form-control" value={mother}
                  maxLength={70}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setMother(lettersOnly);
                  }} required />
              </div>
            </div>

            {/* Adresse */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Adresse</label>
                <input type="text" className="form-control" value={address}
                  maxLength={50}
                  onChange={e => setAddress(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Quartier</label>
                <input type="text" className="form-control" value={neighborHood}
                  maxLength={30}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setNeighborHood(lettersOnly);
                  }} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Commune</label>
                <input type="text" className="form-control" value={municipality}
                  maxLength={30}
                  onChange={e => {
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setMunicipality(lettersOnly);
                  }} required />
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center justify-content-center px-5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCcw size={18} className="me-2 spin" /> Enregistrement...
                  </>
                ) : isUpdate ? (
                  <>
                    <Save size={18} className="me-2" /> Mettre à jour
                  </>
                ) : (
                  <>
                    <Save size={18} className="me-2" /> Ajouter
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default TenantForm;