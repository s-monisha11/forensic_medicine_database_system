import { useEffect, useState } from "react";
import { AdminDashboard } from "./dashboards/AdminDashboard";
import { JMODashboard } from "./dashboards/JMODashboard";
import { MedicalOfficerDashboard } from "./dashboards/MedicalOfficerDashboard";
import { ClericalDashboard } from "./dashboards/ClericalDashboard";
import { ResearchDashboard } from "./dashboards/ResearchDashboard";

export function Dashboard() {
  const [userRole, setUserRole] = useState<string>("admin");

  useEffect(() => {
    const role = sessionStorage.getItem("userRole") || "admin";
    setUserRole(role);
  }, []);

  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "jmo":
      return <JMODashboard />;
    case "doctor":
      return <MedicalOfficerDashboard />;
    case "clerical":
      return <ClericalDashboard />;
    case "research":
      return <ResearchDashboard />;
    default:
      return <AdminDashboard />;
  }
}
