import { useEffect, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { UserPlus, Send, FileCheck, Calendar } from "lucide-react";
import { api } from "../../../services/api";

export function ClericalDashboard() {
  const [stats, setStats] = useState<any>({
    totalPatients: 0,
    totalCases: 0,
    pendingCases: 0,
    completedCases: 0,
    totalEvidence: 0,
    recentCases: [],
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

  const regColumns = [
    { key: "case_number", header: "Case ID" },
    { key: "patient_name", header: "Patient Name" },
    { key: "case_type", header: "Type" },
    { key: "incident_date", header: "Date", render: (v: string) => v ? v.split("T")[0] : "" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value.toLowerCase().replace(" ", "_") as any} />,
    },
  ];

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading Clerical Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Clerical Officer Dashboard</h1>
        <p className="text-muted-foreground">Manage registrations, dispatches, and records</p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={String(stats.totalPatients)}
          icon={UserPlus}
          change="Registered patients"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Total Cases"
          value={String(stats.totalCases)}
          icon={Send}
          change={`${stats.pendingCases} pending`}
          changeType="decrease"
          color="yellow"
        />
        <StatCard
          title="Total Evidence"
          value={String(stats.totalEvidence)}
          icon={FileCheck}
          change="Items cataloged"
          changeType="decrease"
          color="red"
        />
        <StatCard
          title="Completed Today"
          value={String(stats.completedCases)}
          icon={Calendar}
          change="Finalized cases"
          changeType="increase"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-foreground mb-4">Today's Registrations</h3>
          <DataTable columns={regColumns} data={stats.recentCases} />
        </div>

        <div>
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="text-card-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                Register New Patient
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                Register New Case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
