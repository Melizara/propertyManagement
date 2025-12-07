import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { RefreshCcw } from "lucide-react";

interface ActivityLog {
  id: number;
  userMatricule: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
}

export default function HomeActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string>(""); // Filtre actuel

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/activity-logs");
        const data = Array.isArray(res.data) ? res.data : res.data.logs ?? [];
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les logs d'activité.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Liste filtrée selon l'action sélectionnée
  const filteredLogs = filterAction
    ? logs.filter(log => log.action === filterAction)
    : logs;

  // Actions possibles pour filtrer
  const actions = [
    { value: "", label: "Toutes", color: "secondary" },
    { value: "REGISTER", label: "Inscription", color: "success" },
    { value: "LOGIN", label: "Connexion", color: "primary" },
    { value: "CREATE", label: "Insertion", color: "success" },
    { value: "UPDATE", label: "Modification", color: "warning" },
    { value: "DELETE", label: "Résiliation", color: "danger" },
    { value: "GENERATE_PDF", label: "Convention", color: "secondary" },
    { value: "GENERATE_INVOICE", label: "Facture", color: "info" },
    { value: "CONFIRM_PAYMENT", label: "Confirmation paiement", color: "primary" },
  ];


  // Fonction pour traduire l'action en texte français
  const formatAction = (log: ActivityLog) => {
    // Cas LOGIN et REGISTER simplifiés
    if (log.action === "LOGIN") {
      return <span>L'utilisateur <strong>{log.userMatricule}</strong> s'est connecté</span>;
    }
    if (log.action === "REGISTER") {
      return <span>L'utilisateur <strong>{log.userMatricule}</strong> s'est inscrit</span>;
    }

    if (log.action === "GENERATE_PDF") {
      let entityName = log.entity.toLowerCase();
      if (entityName === "location") entityName = "location";
      return (
        <span>
          L'utilisateur <strong>{log.userMatricule}</strong> conventionne le <strong>{entityName}</strong> numéro <strong>{log.entityId}</strong>
        </span>
      );
    }

    // Pour les autres actions
    let actionText = "";
    switch (log.action) {
      case "CREATE": actionText = "ajouté"; break;
      case "UPDATE": actionText = "modifié"; break;
      case "DELETE": actionText = "résilié"; break;
      case "GENERATE_INVOICE": actionText = "facturé"; break;
      case "CONFIRM_PAYMENT": actionText = "confirmé"; break;
      default: actionText = log.action.toLowerCase();
    }


    let entityName = log.entity.toLowerCase();
    if (entityName === "user") entityName = "compte utilisateur";
    if (entityName === "tenant") entityName = "locataire";
    if (entityName === "land") entityName = "terrain";
    if (entityName === "location") entityName = "location";

    return (
      <span>
        L'utilisateur <strong>{log.userMatricule}</strong> a <strong>{actionText}</strong>
        {log.entityId && <> le <strong>{entityName}</strong> numéro <strong>{log.entityId}</strong></>}
      </span>
    );
  };



  return (
    <div className="container-lg p-3" >
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb py-2 px-3 rounded-3">
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/" className="text-decoration-none text-secondary ">Accueil</Link>
          </li>
          <span className="mx-2 mt-1">{" > "}</span>
          <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
            Historique d'activité
          </li>
        </ol>
      </nav>

      {/* Filtres par action */}
      {/* Filtres par action - style badge/tag */}
      <div className="mb-3 d-flex flex-wrap gap-2">
        {actions.map(a => (
          <span
            key={a.value}
            onClick={() => setFilterAction(a.value)}
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "20px",
              backgroundColor: filterAction === a.value ? `var(--bs-${a.color})` : "#f0f0f0",
              color: filterAction === a.value ? "#fff" : "#333",
              fontSize: "0.85rem",
              fontWeight: filterAction === a.value ? 600 : 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              if (filterAction !== a.value) (e.currentTarget as HTMLSpanElement).style.backgroundColor = "#e0e0e0";
            }}
            onMouseLeave={e => {
              if (filterAction !== a.value) (e.currentTarget as HTMLSpanElement).style.backgroundColor = "#f0f0f0";
            }}
          >
            {a.label}
          </span>
        ))}
      </div>


      {loading && <p>Chargement des logs...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Conteneur fixe de la liste */}
      <div
        className="list-container"
        style={{
          height: "70vh", // hauteur fixe
          overflowY: "auto", // scroll vertical à l'intérieur
          position: "relative", // permet la fixation
        }}
      >
        <ul className="list-group">
          {filteredLogs.map(log => {
            let badgeColor = "";
            let badgeText = log.action;
            switch (log.action) {
              case "CREATE": badgeColor = "success"; badgeText = "INSERTION"; break;
              case "UPDATE": badgeColor = "warning"; badgeText = "MODIFICATION"; break;
              case "DELETE": badgeColor = "danger"; badgeText = "RESILIATION"; break;
              case "GENERATE_PDF": badgeColor = "secondary"; badgeText = "CONVENTION"; break;
              case "GENERATE_INVOICE": badgeColor = "info"; badgeText = "FACTURE"; break;
              case "CONFIRM_PAYMENT": badgeColor = "primary"; badgeText = "CONFIRMATION_PAYEMENT"; break;
              case "REGISTER": badgeColor = "success"; badgeText = "INSCRIPTION"; break;
              case "LOGIN": badgeColor = "primary"; badgeText = "CONNEXION"; break;
              default: badgeColor = "secondary";
            }

            return (
              <li
                key={log.id}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
                style={{ gap: "5px" }}
              >
                <div>
                  <span className={`badge bg-${badgeColor} me-2`}>{badgeText}</span>
                  {formatAction(log)}
                </div>
                <small className="text-muted d-flex align-items-center" style={{ gap: "7px" }}>
                  <RefreshCcw size={16} />
                  {new Date(log.timestamp).toLocaleString()}
                </small>
              </li>
            );
          })}

          {!loading && filteredLogs.length === 0 && (
            <li className="list-group-item text-center text-muted">
              Aucun log disponible.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
