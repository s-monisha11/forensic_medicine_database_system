import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UserPlus,
  ClipboardList,
  Microscope,
  FileText,
  Gavel,
  Search,
  Users,
  Activity,
  Database,
  BarChart3,
  Settings,
  Calendar,
  Send,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  to: string;
  icon: any;
  label: string;
  roles: string[];
}

const allNavItems: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "jmo", "doctor", "clerical", "research"] },
  { to: "/dashboard/patients", icon: UserPlus, label: "Patient Registration", roles: ["admin", "clerical"] },
  { to: "/dashboard/clinical-cases", icon: ClipboardList, label: "Clinical Cases", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/autopsy-cases", icon: Microscope, label: "Autopsy Cases", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/evidence", icon: Activity, label: "Evidence", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/court-reports", icon: Gavel, label: "Court Reports", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/court-dispatch", icon: Send, label: "Court Dispatch", roles: ["admin", "clerical"] },
  { to: "/dashboard/search", icon: Search, label: "Search & Retrieval", roles: ["admin", "jmo", "doctor", "clerical"] },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics", roles: ["admin", "research"] },
  { to: "/dashboard/staff", icon: Users, label: "Staff Management", roles: ["admin"] },
  { to: "/dashboard/master-data", icon: Database, label: "Master Data", roles: ["admin", "jmo"] },
  { to: "/dashboard/case-operations", icon: ClipboardList, label: "Case Operations", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/medical-postmortem", icon: Activity, label: "Medical & Postmortem", roles: ["admin", "jmo", "doctor"] },
  { to: "/dashboard/evidence-lab", icon: Microscope, label: "Evidence & Lab", roles: ["admin", "jmo", "doctor", "lab"] },
  { to: "/dashboard/reports-audit", icon: Gavel, label: "Reports & Audit", roles: ["admin", "jmo"] },
  { to: "/dashboard/settings", icon: Settings, label: "System Settings", roles: ["admin"] },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const [userRole, setUserRole] = useState<string>("admin");
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    setUserRole(role);
    const filteredItems = allNavItems.filter((item) => item.roles.includes(role));
    setNavItems(filteredItems);
  }, []);

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shadow-lg">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-primary rounded-lg p-2">
            <FileText className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg">FMDDS</h1>
            <p className="text-xs text-sidebar-foreground/80">Forensic Medicine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          <p>University of Sri Lanka</p>
          <p className="mt-1">Department of Forensic Medicine</p>
        </div>
      </div>
    </aside>
  );
}
