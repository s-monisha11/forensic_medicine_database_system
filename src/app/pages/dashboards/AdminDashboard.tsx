import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Users, Activity, Database, Shield, Server, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const systemData = [
  { metric: "Users", current: 28, max: 50 },
  { metric: "Cases", current: 610, max: 1000 },
  { metric: "Storage", current: 245, max: 500 },
];

const activeUsers = [
  { name: "Dr. Sunil Perera", role: "JMO", status: "approved", lastActive: "Active now", sessions: 3 },
  { name: "Dr. Ranil Jayawardena", role: "Medical Officer", status: "approved", lastActive: "5 min ago", sessions: 1 },
  { name: "K. Mendis", role: "Clerical", status: "approved", lastActive: "15 min ago", sessions: 2 },
  { name: "Dr. Nisha De Silva", role: "Medical Officer", status: "approved", lastActive: "1 hour ago", sessions: 1 },
];

const auditLogs = [
  { timestamp: "2024-05-28 10:45", user: "Dr. Perera", action: "Generated MLR Report", module: "Court Reports" },
  { timestamp: "2024-05-28 10:30", user: "admin", action: "Added new user", module: "User Management" },
  { timestamp: "2024-05-28 10:15", user: "K. Mendis", action: "Updated patient record", module: "Patients" },
  { timestamp: "2024-05-28 09:50", user: "Dr. Jayawardena", action: "Completed autopsy case", module: "Autopsy" },
];

export function AdminDashboard() {
  const columns = [
    { key: "name", header: "User Name" },
    { key: "role", header: "Role" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    { key: "lastActive", header: "Last Active" },
    { key: "sessions", header: "Active Sessions" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">System Administrator Dashboard</h1>
        <p className="text-muted-foreground">Complete system overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="28"
          icon={Users}
          change="3 active now"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Active Sessions"
          value="12"
          icon={Activity}
          change="Peak: 18 today"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Total Cases"
          value="610"
          icon={Database}
          change="+15 this week"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="System Health"
          value="98%"
          icon={Server}
          change="All systems operational"
          changeType="increase"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">System Resource Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={systemData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current" />
              <Bar dataKey="max" fill="#94a3b8" name="Maximum" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-card-foreground">Security & Access</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div>
                <p className="text-sm text-card-foreground">System Security</p>
                <p className="text-xs text-muted-foreground">All checks passed</p>
              </div>
              <span className="text-success">✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-card-foreground">Database Backup</p>
                <p className="text-xs text-muted-foreground">Last: 2 hours ago</p>
              </div>
              <span className="text-primary">●</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-card-foreground">Failed Login Attempts</p>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </div>
              <span className="text-card-foreground">2</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-foreground mb-4">Active Users</h3>
        <DataTable columns={columns} data={activeUsers} />
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-card-foreground">Recent Audit Logs</h3>
        </div>
        <div className="space-y-2">
          {auditLogs.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
              <div className="flex-1">
                <p className="text-card-foreground">
                  <span className="font-medium">{log.user}</span> - {log.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {log.module} • {log.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
