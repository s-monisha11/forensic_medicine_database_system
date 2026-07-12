import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Send, Upload, CheckCircle, Calendar } from "lucide-react";
import { api } from "../../services/api";

export function CourtDispatch() {
  const [dispatchQueue, setDispatchQueue] = useState<any[]>([]);
  const [dispatchedReports, setDispatchedReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [stats, setStats] = useState({ pending: 0, dispatched: 0, pendingReceipt: 0, completed: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await api.getReports();
      const pending = data.filter((r: any) => r.status === "Pending" || r.status === "Draft");
      const submitted = data.filter((r: any) => r.status === "Submitted");
      const approved = data.filter((r: any) => r.status === "Approved");
      setDispatchQueue(pending);
      setDispatchedReports(submitted);
      setStats({
        pending: pending.length,
        dispatched: submitted.length,
        pendingReceipt: submitted.filter((r: any) => !r.submission_date).length,
        completed: approved.length,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const statusMap: Record<string, string> = {
    Draft: "pending", Pending: "pending", Submitted: "completed", Approved: "approved", Rejected: "urgent",
  };

  const queueColumns = [
    { key: "report_id", header: "Report ID" },
    { key: "case_number", header: "Case Ref" },
    { key: "court_name", header: "Court" },
    { key: "report_type", header: "Report Type" },
    { key: "status", header: "Status", render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} /> },
    { key: "prepared_by_name", header: "Prepared By" },
    {
      key: "actions", header: "Actions",
      render: () => (
        <button onClick={() => setShowDispatchModal(true)} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90">
          Dispatch
        </button>
      ),
    },
  ];

  const dispatchedColumns = [
    { key: "report_id", header: "Report ID" },
    { key: "court_name", header: "Court" },
    { key: "submission_date", header: "Submitted Date", render: (v: string) => v ? v.split("T")[0] : "Not yet" },
    { key: "status", header: "Status", render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} /> },
  ];

  return (
    <div className="space-y-6">
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div>
        <h1 className="text-foreground mb-2">Court Dispatch Management</h1>
        <p className="text-muted-foreground">Manage report dispatches and receipt confirmations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Pending Dispatch</p><Send className="w-5 h-5 text-warning" /></div>
          <p className="text-2xl text-card-foreground">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Dispatched</p><CheckCircle className="w-5 h-5 text-primary" /></div>
          <p className="text-2xl text-card-foreground">{stats.dispatched}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Pending Receipt</p><Upload className="w-5 h-5 text-destructive" /></div>
          <p className="text-2xl text-card-foreground">{stats.pendingReceipt}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2"><p className="text-sm text-muted-foreground">Completed</p><Calendar className="w-5 h-5 text-success" /></div>
          <p className="text-2xl text-card-foreground">{stats.completed}</p>
        </div>
      </div>

      <div>
        <h3 className="text-foreground mb-4">Dispatch Queue</h3>
        {loading ? <div className="text-center py-8 text-muted-foreground animate-pulse">Loading...</div> : <DataTable columns={queueColumns} data={dispatchQueue} />}
      </div>

      <div>
        <h3 className="text-foreground mb-4">Dispatched Reports</h3>
        {loading ? <div className="text-center py-8 text-muted-foreground animate-pulse">Loading...</div> : <DataTable columns={dispatchedColumns} data={dispatchedReports} />}
      </div>

      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-card-foreground">Dispatch Report</h2>
              <button onClick={() => setShowDispatchModal(false)} className="text-muted-foreground hover:text-card-foreground">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm text-muted-foreground mb-2">Dispatch Method <span className="text-destructive">*</span></label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"><option>Hand Delivery</option><option>Registered Post</option><option>Courier Service</option><option>Email (Official)</option></select></div>
              <div><label className="block text-sm text-muted-foreground mb-2">Dispatch Date <span className="text-destructive">*</span></label>
                <input type="date" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" /></div>
              <div><label className="block text-sm text-muted-foreground mb-2">Tracking Number</label>
                <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter tracking/reference number" /></div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Confirm Dispatch</button>
              <button onClick={() => setShowDispatchModal(false)} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
