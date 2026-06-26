import { Bell, Menu, Moon, Sun, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface NavbarProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const roleDisplayNames: Record<string, string> = {
  admin: "System Administrator",
  jmo: "Judicial Medical Officer",
  doctor: "Medical Officer",
  clerical: "Clerical Officer",
  research: "Research User",
};

export function Navbar({ toggleSidebar, darkMode, toggleDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState("User");
  const [userRole, setUserRole] = useState("Staff");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const storedRole = sessionStorage.getItem("userRole");
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setUserRole(roleDisplayNames[storedRole] || "Staff");
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const notifications = [
    { id: 1, text: "3 MLR reports pending approval", type: "warning", time: "5 min ago" },
    { id: 2, text: "Court date scheduled for Case #2024-089", type: "info", time: "1 hour ago" },
    { id: 3, text: "New autopsy case assigned", type: "urgent", time: "2 hours ago" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-foreground">Forensic Medicine Department Database System</h2>
            <p className="text-sm text-muted-foreground">Judicial Medical Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notif.type === "urgent"
                              ? "bg-destructive"
                              : notif.type === "warning"
                              ? "bg-warning"
                              : "bg-primary"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-popover-foreground">{notif.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-border relative">
            <div className="text-right">
              <p className="text-sm text-foreground">{username}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <User className="w-5 h-5 text-primary-foreground" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent text-left text-sm text-popover-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
