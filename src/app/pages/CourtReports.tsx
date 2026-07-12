import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, FileText, Printer, Send, Eye } from "lucide-react";
import { api } from "../../services/api";

export function CourtReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, submitted: 0, draft: 0 });

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
      setStats({
        total: data.length,
        pending: data.filter((r: any) => r.status === "Pending").length,
        submitted: data.filter((r: any) => r.status === "Submitted" || r.status === "Approved").length,
        draft: data.filter((r: any) => r.status === "Draft").length,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const statusMap: Record<string, string> = {
    Draft: "pending", Pending: "in_progress", Submitted: "completed", Approved: "approved", Rejected: "urgent",
  };

  const columns = [
    { key: "report_id", header: "Report ID" },
    { key: "case_number", header: "Case Reference" },
    { key: "report_type", header: "Report Type",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs ${value === "Medico-Legal" || value === "Clinical Examination" ? "bg-primary/20 text-primary" : "bg-success/20 text-success"}`}>
          {value}
        </span>
      ),
    },
    { key: "patient_name", header: "Patient" },
    { key: "prepared_by_name", header: "Prepared By" },
    { key: "court_name", header: "Court" },
    { key: "status", header: "Status", render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} /> },
    {
      key: "actions", header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button onClick={() => { setSelectedReport(row); setShowPreview(true); }} className="p-1 text-primary hover:bg-primary/10 rounded"><Eye className="w-4 h-4" /></button>
          <button className="p-1 text-muted-foreground hover:bg-accent rounded"><Printer className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Court Report Management</h1>
          <p className="text-muted-foreground">Generate and manage medico-legal reports for court proceedings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Total Reports</p><p className="text-2xl text-card-foreground">{stats.total}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Pending Approval</p><p className="text-2xl text-warning">{stats.pending}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Dispatched</p><p className="text-2xl text-success">{stats.submitted}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Draft</p><p className="text-2xl text-destructive">{stats.draft}</p></div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground animate-pulse">Loading reports...</div>
      ) : (
        <DataTable columns={columns} data={reports} />
      )}

      {showPreview && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Report Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-card-foreground">✕</button>
            </div>
            <div className="p-8 bg-white text-gray-900">
              <div className="text-center mb-8">
                <h2 className="text-xl mb-2">{selectedReport.report_type?.toUpperCase()} REPORT</h2>
                <p className="text-sm text-gray-600">University of Sri Lanka</p>
                <p className="text-sm text-gray-600">Department of Forensic Medicine</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Report No:</strong> {selectedReport.report_id}</div>
                  <div><strong>Date:</strong> {selectedReport.created_at?.split("T")[0]}</div>
                  <div><strong>Case Reference:</strong> {selectedReport.case_number}</div>
                  <div><strong>Court:</strong> {selectedReport.court_name || "Not specified"}</div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <h3 className="mb-2">Patient Information</h3>
                  <p><strong>Name:</strong> {selectedReport.patient_name}</p>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <h3 className="mb-2">Prepared By</h3>
                  <p>{selectedReport.prepared_by_name || "Not specified"}</p>
                </div>
                {selectedReport.remarks && (
                  <div className="border-t border-gray-300 pt-4">
                    <h3 className="mb-2">Remarks</h3>
                    <p className="text-gray-700">{selectedReport.remarks}</p>
                  </div>
                )}
                <div className="mt-8 pt-4 border-t border-gray-300">
                  <p className="mb-8"><strong>Examining Officer:</strong> {selectedReport.prepared_by_name}</p>
                  <p><strong>Signature:</strong> ___________________________</p>
                  <p className="text-xs text-gray-600 mt-4">This report is issued for official use only</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"><Printer className="w-4 h-4" />Print Report</button>
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
