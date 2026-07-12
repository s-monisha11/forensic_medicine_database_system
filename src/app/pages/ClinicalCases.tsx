import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, FileText, Eye, X, CheckCircle } from "lucide-react";
import { api } from "../../services/api";

export function ClinicalCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCase, setNewCase] = useState({
    patient_id: "",
    incident_date: "",
    police_station: "",
    incident_location: "",
    description: "",
    assigned_staff_id: "",
  });

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [casesData, patientsData, staffData] = await Promise.all([
        api.getCases(),
        api.getPatients(),
        api.getStaff(),
      ]);
      const clinical = casesData.filter((c: any) => c.case_type === "Clinical");
      setCases(clinical);
      setPatients(patientsData);
      setStaff(staffData);
      setStats({
        total: clinical.length,
        pending: clinical.filter((c: any) => c.status === "Pending").length,
        inProgress: clinical.filter((c: any) => c.status === "In Progress").length,
        completed: clinical.filter((c: any) => c.status === "Completed").length,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddCase = async () => {
    try {
      await api.addCase({
        patient_id: Number(newCase.patient_id),
        case_type: "Clinical",
        incident_date: newCase.incident_date,
        police_station: newCase.police_station,
        incident_location: newCase.incident_location,
        description: newCase.description,
        assigned_staff_id: newCase.assigned_staff_id ? Number(newCase.assigned_staff_id) : null,
        status: "Pending",
      });
      setShowAddModal(false);
      setShowSuccess(true);
      setNewCase({ patient_id: "", incident_date: "", police_station: "", incident_location: "", description: "", assigned_staff_id: "" });
      loadData();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create case.");
    }
  };

  const statusMap: Record<string, string> = {
    Pending: "pending",
    "In Progress": "in_progress",
    Completed: "completed",
    Urgent: "urgent",
    Closed: "completed",
  };

  const columns = [
    { key: "case_number", header: "Case Reference" },
    { key: "patient_name", header: "Patient Name" },
    {
      key: "incident_date",
      header: "Exam Date",
      render: (val: string) => (val ? val.split("T")[0] : ""),
    },
    { key: "police_station", header: "Police Station" },
    { key: "assigned_staff_name", header: "Doctor" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCase(row);
            setShowModal(true);
          }}
          className="text-primary hover:text-primary/80"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <p className="text-success">Clinical case created successfully!</p>
          </div>
          <button onClick={() => setShowSuccess(false)}>
            <X className="w-4 h-4 text-success" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Clinical Case Management</h1>
          <p className="text-muted-foreground">Manage clinical examination cases and reports</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Clinical Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
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

      {/* View Details Modal */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Clinical Case Details</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-card-foreground">✕</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Case Reference</p><p className="text-card-foreground">{selectedCase.case_number}</p></div>
                <div><p className="text-sm text-muted-foreground">Patient Name</p><p className="text-card-foreground">{selectedCase.patient_name}</p></div>
                <div><p className="text-sm text-muted-foreground">Incident Date</p><p className="text-card-foreground">{selectedCase.incident_date?.split("T")[0]}</p></div>
                <div><p className="text-sm text-muted-foreground">Police Station</p><p className="text-card-foreground">{selectedCase.police_station}</p></div>
                <div><p className="text-sm text-muted-foreground">Doctor</p><p className="text-card-foreground">{selectedCase.assigned_staff_name || "Not assigned"}</p></div>
                <div><p className="text-sm text-muted-foreground">Status</p><StatusBadge status={(statusMap[selectedCase.status] || "pending") as any} /></div>
              </div>
              {selectedCase.description && (
                <div>
                  <h3 className="text-card-foreground mb-3">Description</h3>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-card-foreground">{selectedCase.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Create New Clinical Case</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-card-foreground">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Patient <span className="text-destructive">*</span></label>
                  <select
                    value={newCase.patient_id}
                    onChange={(e) => setNewCase({ ...newCase, patient_id: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  >
                    <option value="">Select patient</option>
                    {patients.map((p: any) => (
                      <option key={p.patient_id} value={p.patient_id}>{p.full_name} ({p.nic || 'No NIC'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Incident Date <span className="text-destructive">*</span></label>
                  <input type="date" value={newCase.incident_date} onChange={(e) => setNewCase({ ...newCase, incident_date: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Police Station <span className="text-destructive">*</span></label>
                  <input type="text" value={newCase.police_station} onChange={(e) => setNewCase({ ...newCase, police_station: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter police station" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Assigned Doctor</label>
                  <select value={newCase.assigned_staff_id} onChange={(e) => setNewCase({ ...newCase, assigned_staff_id: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
                    <option value="">Select doctor</option>
                    {staff.filter((s: any) => s.role === "JMO" || s.role === "Doctor").map((s: any) => (
                      <option key={s.staff_id} value={s.staff_id}>{s.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-2">Description</label>
                  <textarea value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" rows={4} placeholder="Enter case description..." />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={handleAddCase} disabled={!newCase.patient_id || !newCase.incident_date || !newCase.police_station}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Create Case
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
