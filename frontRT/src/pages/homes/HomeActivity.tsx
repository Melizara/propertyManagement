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

  const formatAction = (log: ActivityLog) => {
    let actionText = "";
    switch (log.action) {
      case "CREATE":
        actionText = "a ajouté";
        break;
      case "UPDATE":
        actionText = "a modifié";
        break;
      case "DELETE":
        actionText = "a supprimé";
        break;
      case "GENERATE_PDF":
        actionText = "a généré un PDF pour";
        break;
      case "GENERATE_INVOICE":
        actionText = "a généré une facture pour";
        break;
      case "CONFIRM_PAYMENT":
        actionText = "a confirmé le paiement du";
        break;
      default:
        actionText = log.action.toLowerCase();
    }

    // Traduire le nom de l'entité
    let entityName = log.entity.toLowerCase();
    if (entityName === "tenant") entityName = "locataire";
    else if (entityName === "land") entityName = "terrain";
    else if (entityName === "location") entityName = "location";

    return (
      <span>
        L'utilisateur <strong>{log.userMatricule}</strong>{" "}
        <strong>{actionText}</strong> le <strong>{entityName}</strong>{" "}
        {log.entityId && (
          <>
            numéro <strong>{log.entityId}</strong>
          </>
        )}{" "}
      </span>
    );
  };

  return (
    <div className="container-lg p-3" style={{ marginTop: "32px" }} >
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb py-2 px-3 rounded-3">
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/" className="text-decoration-none text-secondary" style={{ display: "inline-block" }}>
              Accueil
            </Link>
          </li>
          <span className="mx-2 mt-1">{" > "}</span>
          <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
            Historique d'activité
          </li>
        </ol>
      </nav>

      {loading && <p>Chargement des logs...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && logs.length === 0 && <p>Aucun log disponible.</p>}

      {/* Liste scrollable */}
      <ul
        className="list-group overflow-auto"
        style={{ maxHeight: "80vh" }} // Hauteur max pour la liste
      >
        {logs.map(log => {
          let badgeColor = "";
          switch (log.action) {
            case "CREATE":
              badgeColor = "success";
              break;
            case "UPDATE":
              badgeColor = "warning";
              break;
            case "DELETE":
              badgeColor = "danger";
              break;
            case "GENERATE_PDF":
            case "GENERATE_INVOICE":
              badgeColor = "info";
              break;
            case "CONFIRM_PAYMENT":
              badgeColor = "primary";
              break;
            default:
              badgeColor = "secondary";
          }
          return (
            <li
              key={log.id}
              className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
              style={{ gap: "5px" }}
            >
              <div>
                <span className={`badge bg-${badgeColor} me-2`}>{log.action}</span>
                {formatAction(log)}
              </div>
              <small className="text-muted d-flex align-items-center" style={{ gap: "7px" }}>
                <RefreshCcw size={16} />
                {new Date(log.timestamp).toLocaleString()}
              </small>
            </li>
          );
        })}
      </ul>
    </div>

  );
}
