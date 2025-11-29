import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

    // Format final
    return `L'utilisateur ${log.userMatricule} ${actionText} ${entityName} ${log.entityId ?? ""} à la date ${new Date(log.timestamp).toLocaleString()}`;
  };


  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-start p-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb py-2 px-3 rounded-3">
          <li className="breadcrumb-item" style={{ paddingTop: "4px" }}>
            <Link to="/" className="text-decoration-none text-secondary">
              Accueil
            </Link>
          </li>
          <span className="mx-2 mt-1">{">"}</span>
          <li className="breadcrumb-item active text-primary fs-5" aria-current="page">
            Historique
          </li>
        </ol>
      </nav>
      <h2 className="mb-3">Historique des activités</h2>

      {loading && <p>Chargement des logs...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && logs.length === 0 && <p>Aucun log disponible.</p>}

      <ul className="list-group flex-grow-1 overflow-auto">
        {logs.map(log => (
          <li key={log.id} className="list-group-item">
            {formatAction(log)}
          </li>
        ))}
      </ul>
    </div>
  );
}
