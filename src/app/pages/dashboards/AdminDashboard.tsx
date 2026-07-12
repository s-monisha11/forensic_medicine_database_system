import { useEffect, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Users, Activity, Database, Shield, Server, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "../../../services/api";

export function AdminDashboard() {
  const [stats, setStats] = useState<any>({
    totalPatients: 0,
    totalCases: 0,
    pendingCases: 0,
    inProgressCases: 0,
    completedCases: 0,
    urgentCases: 0,
    totalAutopsies: 0,
    totalClinical: 0,
    totalEvidence: 0,
    totalReports: 0,
    pendingReports: 0,
    totalStaff: 0,
    recentCases: [],
    monthlyCases: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const columns = [
    { key: "case_number", header: "Case Number" },
    { key: "patient_name", header: "Patient Name" },
    { key: "case_type", header: "Type" },
    { key: "incident_date", header: "Date", render: (v: string) => v ? v.split("T")[0] : "" },
    { key: "assigned_staff_name", header: "Doctor" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value.toLowerCase().replace(" ", "_") as any} />,
    },
  ];

  const systemData = [
    { metric: "Staff", current: stats.totalStaff, max: 50 },
    { metric: "Cases", current: stats.totalCases, max: 100 },
    { metric: "Evidence", current: stats.totalEvidence, max: 150 },
  ];

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading Admin Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">System Administrator Dashboard</h1>
        <p className="text-muted-foreground">Complete system overview and management</p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={String(stats.totalStaff)}
          icon={Users}
          change="Registered personnel"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Total Patients"
          value={String(stats.totalPatients)}
          icon={Activity}
          change="Registered patients"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Total Cases"
          value={String(stats.totalCases)}
          icon={Database}
          change={`${stats.pendingCases} pending`}
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Evidence Stored"
          value={String(stats.totalEvidence)}
          icon={Server}
          change="In custody"
          changeType="increase"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">System Metrics Overview</h3>
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
              <Bar dataKey="current" fill="#3b82f6" name="Current Count" />
              <Bar dataKey="max" fill="#94a3b8" name="Capacity Alert Threshold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-card-foreground">System Security & Health</h3>
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
                <p className="text-sm text-card-foreground">Database Status</p>
                <p className="text-xs text-muted-foreground">Connected to MySQL</p>
              </div>
              <span className="text-primary">●</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-card-foreground">Vite Development Server</p>
                <p className="text-xs text-muted-foreground">Proxy enabled for /api</p>
              </div>
              <span className="text-card-foreground">OK</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-foreground mb-4">Recently Added Cases</h3>
        <DataTable columns={columns} data={stats.recentCases} />
      </div>
    </div>
  );
}
