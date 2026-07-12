import { useEffect, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { ClipboardList, Microscope, Upload, CheckCircle } from "lucide-react";
import { api } from "../../../services/api";

export function MedicalOfficerDashboard() {
  const [stats, setStats] = useState<any>({
    totalCases: 0,
    inProgressCases: 0,
    completedCases: 0,
    pendingReports: 0,
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

  const columns = [
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

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading Medical Officer Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Medical Officer Dashboard</h1>
        <p className="text-muted-foreground">Your assigned cases and examination findings</p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cases"
          value={String(stats.totalCases)}
          icon={ClipboardList}
          change="Cases in database"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={String(stats.inProgressCases)}
          icon={Microscope}
          change="Active examinations"
          changeType="increase"
          color="yellow"
        />
        <StatCard
          title="Completed"
          value={String(stats.completedCases)}
          icon={CheckCircle}
          change="Finalized cases"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Pending Reports"
          value={String(stats.pendingReports)}
          icon={Upload}
          change="MLR reports to file"
          changeType="decrease"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-foreground mb-4">Assigned Cases</h3>
          <DataTable columns={columns} data={stats.recentCases} />
        </div>

        <div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm mb-4">
            <h3 className="text-card-foreground mb-4">Recent System Log</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {stats.recentCases.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="border-l-2 border-primary pl-3">
                  <p className="text-card-foreground">Case {item.case_number} recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.patient_name} • {item.incident_date?.split("T")[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="text-card-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                Add Examination Findings
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                Upload Evidence Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
