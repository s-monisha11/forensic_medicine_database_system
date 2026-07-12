import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Image, FileText } from "lucide-react";
import { api } from "../../services/api";

export function AutopsyCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("external");
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const casesData = await api.getCases();
      const autopsy = casesData.filter((c: any) => c.case_type === "Autopsy");
      setCases(autopsy);
      setStats({
        total: autopsy.length,
        pending: autopsy.filter((c: any) => c.status === "Pending").length,
        inProgress: autopsy.filter((c: any) => c.status === "In Progress").length,
        completed: autopsy.filter((c: any) => c.status === "Completed").length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  const statusMap: Record<string, string> = {
    Pending: "pending", "In Progress": "in_progress", Completed: "completed", Urgent: "urgent", Closed: "completed",
  };

  const columns = [
    { key: "case_number", header: "PM Serial No." },
    { key: "patient_name", header: "Deceased" },
    {
      key: "incident_date",
      header: "Date",
      render: (val: string) => (val ? val.split("T")[0] : ""),
    },
    { key: "police_station", header: "Police Station" },
    { key: "assigned_staff_name", header: "JMO" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} />,
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Autopsy Case Management</h1>
          <p className="text-muted-foreground">Post-mortem examinations and investigations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Autopsy Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Autopsies</p>
          <p className="text-2xl text-card-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl text-warning">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl text-primary">{stats.inProgress}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl text-success">{stats.completed}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">Loading cases...</div>
      ) : (
        <DataTable columns={columns} data={cases} />
      )}

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border">
          <div className="flex">
            {["external", "internal", "toxicology", "histology"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 capitalize transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary bg-accent/50" : "text-muted-foreground hover:text-card-foreground"}`}>
                {tab} Examination
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "external" && (
            <div className="space-y-4">
              <h3 className="text-card-foreground">External Examination Findings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Body Length</label>
                  <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter body length" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Body Weight</label>
                  <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter body weight" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-2">External Findings</label>
                  <textarea className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" rows={4} placeholder="Describe external examination findings..." />
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-2">Upload External Photos</p>
                <p className="text-sm text-muted-foreground">Click to upload images</p>
              </div>
            </div>
          )}
          {activeTab === "internal" && (
            <div className="space-y-4">
              <h3 className="text-card-foreground">Internal Examination Findings</h3>
              {["Cardiovascular System", "Respiratory System", "Digestive System"].map((system) => (
                <div key={system}>
                  <label className="block text-sm text-muted-foreground mb-2">{system}</label>
                  <textarea className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" rows={3} placeholder={`Describe ${system.toLowerCase()} findings...`} />
                </div>
              ))}
            </div>
          )}
          {activeTab === "toxicology" && (
            <div className="space-y-4">
              <h3 className="text-card-foreground">Toxicology Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Sample Type</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
                    <option>Select sample type</option><option>Blood</option><option>Urine</option><option>Tissue</option><option>Gastric Content</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Laboratory Reference</label>
                  <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter lab reference number" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-2">Toxicology Results</label>
                  <textarea className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" rows={4} placeholder="Enter toxicology analysis results..." />
                </div>
              </div>
            </div>
          )}
          {activeTab === "histology" && (
            <div className="space-y-4">
              <h3 className="text-card-foreground">Histology Report</h3>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tissue Sample Details</label>
                <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Describe tissue samples collected" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Microscopic Findings</label>
                <textarea className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" rows={5} placeholder="Enter microscopic examination findings..." />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-6 border-t border-border mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <FileText className="w-4 h-4" />Save Findings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors">
              Generate PMR Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
