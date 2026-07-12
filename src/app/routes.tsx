import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { PatientRegistration } from "./pages/PatientRegistration";
import { ClinicalCases } from "./pages/ClinicalCases";
import { AutopsyCases } from "./pages/AutopsyCases";
import { Evidence } from "./pages/Evidence";
import { CourtReports } from "./pages/CourtReports";
import { CourtDispatch } from "./pages/CourtDispatch";
import { Search } from "./pages/Search";
import { Analytics } from "./pages/Analytics";
import { Staff } from "./pages/Staff";
import { Settings } from "./pages/Settings";
import { MasterData } from "./pages/MasterData";
import { CaseOperations } from "./pages/CaseOperations";
import { MedicalPostmortem } from "./pages/MedicalPostmortem";
import { EvidenceLab } from "./pages/EvidenceLab";
import { ReportsAudit } from "./pages/ReportsAudit";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: PatientRegistration },
      { path: "clinical-cases", Component: ClinicalCases },
      { path: "autopsy-cases", Component: AutopsyCases },
      { path: "evidence", Component: Evidence },
      { path: "court-reports", Component: CourtReports },
      { path: "court-dispatch", Component: CourtDispatch },
      { path: "search", Component: Search },
      { path: "analytics", Component: Analytics },
      { path: "staff", Component: Staff },
      { path: "master-data", Component: MasterData },
      { path: "case-operations", Component: CaseOperations },
      { path: "medical-postmortem", Component: MedicalPostmortem },
      { path: "evidence-lab", Component: EvidenceLab },
      { path: "reports-audit", Component: ReportsAudit },
      { path: "settings", Component: Settings },
    ],
  },
]);
