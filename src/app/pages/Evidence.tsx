import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Image, MapPin, Clock } from "lucide-react";
import { api } from "../../services/api";

export function Evidence() {
  const [evidenceItems, setEvidenceItems] = useState<any[]>([]);
  const [chainOfCustody, setChainOfCustody] = useState<any[]>([]);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ total: 0, stored: 0, inLab: 0, collected: 0 });

  useEffect(() => {
    loadEvidence();
  }, []);

  async function loadEvidence() {
    setLoading(true);
    try {
      const data = await api.getEvidence();
      setEvidenceItems(data);
      setStats({
        total: data.length,
        stored: data.filter((e: any) => e.current_status === "Stored").length,
        inLab: data.filter((e: any) => e.current_status === "Sent to Laboratory").length,
        collected: data.filter((e: any) => e.current_status === "Collected").length,
      });
      if (data.length > 0) {
        loadChainOfCustody(data[0].evidence_id);
        setSelectedEvidenceId(data[0].evidence_id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadChainOfCustody(evidenceId: number) {
    try {
      const data = await api.getChainOfCustody(evidenceId);
      setChainOfCustody(data);
    } catch {
      setChainOfCustody([]);
    }
  }

  const statusMap: Record<string, string> = {
    Collected: "pending", Stored: "completed", "Sent to Laboratory": "in_progress", Returned: "approved", Disposed: "completed",
  };

  const columns = [
    { key: "evidence_code", header: "Evidence ID" },
    { key: "case_number", header: "Case Reference" },
    { key: "evidence_type", header: "Type" },
    { key: "description", header: "Description" },
    { key: "storage_location", header: "Storage Location" },
    { key: "collected_date", header: "Collected Date", render: (v: string) => v ? v.split("T")[0] : "" },
    { key: "current_status", header: "Status", render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} /> },
  ];

  const selectedEvidence = evidenceItems.find((e) => e.evidence_id === selectedEvidenceId);

  return (
    <div className="space-y-6">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Evidence Management</h1>
          <p className="text-muted-foreground">Track and manage forensic evidence</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />Add Evidence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Total Evidence Items</p><p className="text-2xl text-card-foreground">{stats.total}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">In Storage</p><p className="text-2xl text-success">{stats.stored}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">In Analysis</p><p className="text-2xl text-primary">{stats.inLab}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Collected</p><p className="text-2xl text-warning">{stats.collected}</p></div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">Loading evidence...</div>
      ) : (
        <DataTable columns={columns} data={evidenceItems} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-card-foreground mb-4">
            Chain of Custody {selectedEvidence ? `- ${selectedEvidence.evidence_code}` : ""}
          </h3>
          {chainOfCustody.length === 0 ? (
            <p className="text-muted-foreground text-sm">No chain of custody records found.</p>
          ) : (
            <div className="space-y-4">
              {chainOfCustody.map((entry: any, index: number) => (
                <div key={entry.custody_id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    {index < chainOfCustody.length - 1 && <div className="w-0.5 h-full bg-border mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground">{entry.transfer_date?.replace("T", " ").slice(0, 16)}</p>
                    <p className="text-card-foreground mb-1">{entry.purpose}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.from_staff_name ? `From: ${entry.from_staff_name}` : ""}
                      {entry.to_staff_name ? ` → To: ${entry.to_staff_name}` : ""}
                    </p>
                    {entry.remarks && <p className="text-xs text-muted-foreground mt-1">{entry.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-card-foreground mb-4">Evidence Gallery</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            Upload More Photos
          </button>
        </div>
      </div>
    </div>
  );
}
