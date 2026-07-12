import { useEffect, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { ClipboardList, Microscope, FileText, Calendar, AlertCircle } from "lucide-react";
import { api } from "../../../services/api";

export function JMODashboard() {
  const [stats, setStats] = useState<any>({
    totalAutopsies: 0,
    totalClinical: 0,
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

  const caseColumns = [
    { key: "case_number", header: "Case ID" },
    { key: "patient_name", header: "Patient Name" },
    { key: "case_type", header: "Type" },
    { key: "incident_date", header: "Incident Date", render: (v: string) => v ? v.split("T")[0] : "" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value.toLowerCase().replace(" ", "_") as any} />,
    },
  ];

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading JMO Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Judicial Medical Officer Dashboard</h1>
        <p className="text-muted-foreground">Your assigned cases, reports, and court schedules</p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clinical Cases"
          value={String(stats.totalClinical)}
          icon={ClipboardList}
          change="Total in system"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Autopsy Cases"
          value={String(stats.totalAutopsies)}
          icon={Microscope}
          change="Total postmortems"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Pending Reports"
          value={String(stats.pendingReports)}
          icon={FileText}
          change="Awaiting submission"
          changeType="decrease"
          color="yellow"
        />
        <StatCard
          title="Total Patients"
          value={String(stats.totalPatients)}
          icon={Calendar}
          change="Registered patients"
          changeType="increase"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-foreground mb-4">Recently Logged Cases</h3>
          <DataTable columns={caseColumns} data={stats.recentCases} />
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-card-foreground">Quick Reminders</h3>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Make sure to register any new clinical examinations promptly.</p>
              <p>• Verify chain of custody before analyzing samples.</p>
              <p>• Review draft reports before finalizing and submitting to court.</p>
            </div>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="text-card-foreground">System Notifications</h3>
            </div>
            <div className="space-y-2 text-sm text-card-foreground">
              <p>• Please report any database sync issues to the Admin.</p>
              <p>• Double check NIC values during registration to prevent duplicate entries.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
