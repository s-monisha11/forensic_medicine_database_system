import { useState, useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Edit, Trash2, Shield, Activity, X, CheckCircle } from "lucide-react";
import { api } from "../../services/api";

export function Staff() {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newStaff, setNewStaff] = useState({
    full_name: "", role: "", email: "", contact_no: "", specialization: "",
  });

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await api.getStaff();
      setStaffMembers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddStaff = async () => {
    try {
      await api.addStaff(newStaff);
      setShowAddModal(false);
      setSuccessMessage("Staff member added successfully!");
      setShowSuccess(true);
      setNewStaff({ full_name: "", role: "", email: "", contact_no: "", specialization: "" });
      loadStaff();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;
    try {
      await api.updateStaff(editingStaff.staff_id, newStaff);
      setEditingStaff(null);
      setShowAddModal(false);
      setSuccessMessage("Staff member updated successfully!");
      setShowSuccess(true);
      setNewStaff({ full_name: "", role: "", email: "", contact_no: "", specialization: "" });
      loadStaff();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await api.deleteStaff(id);
      setSuccessMessage("Staff member deleted!");
      setShowSuccess(true);
      loadStaff();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setNewStaff({
      full_name: staff.full_name, role: staff.role, email: staff.email || "",
      contact_no: staff.contact_no || "", specialization: staff.specialization || "",
    });
    setShowAddModal(true);
  };

  const roleStatusMap: Record<string, string> = {
    Admin: "approved", JMO: "approved", Doctor: "approved", "Laboratory Staff": "in_progress",
    "Clerical Officer": "completed", "Research User": "pending",
  };

  const columns = [
    { key: "staff_id", header: "ID" },
    { key: "full_name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "email", header: "Email" },
    { key: "contact_no", header: "Phone" },
    { key: "specialization", header: "Specialization" },
    {
      key: "actions", header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEditStaff(row)} className="p-1 text-primary hover:bg-primary/10 rounded"><Edit className="w-4 h-4" /></button>
          <button onClick={() => handleDeleteStaff(row.staff_id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  const doctors = staffMembers.filter(s => s.role === "JMO" || s.role === "Doctor").length;
  const clerks = staffMembers.filter(s => s.role === "Clerical Officer").length;

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success" /><p className="text-success">{successMessage}</p></div>
          <button onClick={() => setShowSuccess(false)}><X className="w-4 h-4 text-success" /></button>
        </div>
      )}
      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}<button onClick={() => setError("")} className="ml-2 underline">Dismiss</button></div>}

      <div className="flex items-center justify-between">
        <div><h1 className="text-foreground mb-2">Staff Management</h1><p className="text-muted-foreground">Manage staff, roles, and access permissions</p></div>
        <button onClick={() => { setEditingStaff(null); setNewStaff({ full_name: "", role: "", email: "", contact_no: "", specialization: "" }); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Total Staff</p><p className="text-2xl text-card-foreground">{staffMembers.length}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Doctors</p><p className="text-2xl text-primary">{doctors}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Clerical Staff</p><p className="text-2xl text-success">{clerks}</p></div>
        <div className="bg-card rounded-lg p-4 border border-border"><p className="text-sm text-muted-foreground mb-1">Other</p><p className="text-2xl text-warning">{staffMembers.length - doctors - clerks}</p></div>
      </div>

      {loading ? <div className="text-center py-8 text-muted-foreground animate-pulse">Loading staff...</div> : <DataTable columns={columns} data={staffMembers} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-primary" /><h3 className="text-card-foreground">Role Permissions</h3></div>
          <div className="space-y-3">
            {[
              { role: "Judicial Medical Officer", permissions: "Full Access" },
              { role: "Medical Officer", permissions: "Case Management, Reports" },
              { role: "Clerical Officer", permissions: "Data Entry, Records" },
              { role: "System Administrator", permissions: "All Permissions" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div><p className="text-sm text-card-foreground">{item.role}</p><p className="text-xs text-muted-foreground mt-1">{item.permissions}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-success" /><h3 className="text-card-foreground">Staff Summary</h3></div>
          <div className="space-y-3">
            {staffMembers.slice(0, 5).map((s: any) => (
              <div key={s.staff_id} className="border-l-2 border-primary pl-4 pb-3">
                <p className="text-sm text-card-foreground">{s.full_name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.role} • {s.email || "No email"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-card-foreground">{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingStaff(null); }} className="text-muted-foreground hover:text-card-foreground">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-muted-foreground mb-2">Full Name <span className="text-destructive">*</span></label>
                  <input type="text" value={newStaff.full_name} onChange={(e) => setNewStaff({ ...newStaff, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter full name" /></div>
                <div><label className="block text-sm text-muted-foreground mb-2">Role <span className="text-destructive">*</span></label>
                  <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
                    <option value="">Select role</option><option value="JMO">Judicial Medical Officer</option><option value="Doctor">Medical Officer</option>
                    <option value="Clerical Officer">Clerical Officer</option><option value="Admin">System Administrator</option>
                    <option value="Laboratory Staff">Laboratory Staff</option><option value="Research User">Research User</option>
                  </select></div>
                <div><label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <input type="email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter email" /></div>
                <div><label className="block text-sm text-muted-foreground mb-2">Phone</label>
                  <input type="tel" value={newStaff.contact_no} onChange={(e) => setNewStaff({ ...newStaff, contact_no: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter phone" /></div>
                <div className="col-span-2"><label className="block text-sm text-muted-foreground mb-2">Specialization</label>
                  <input type="text" value={newStaff.specialization} onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter specialization" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button onClick={editingStaff ? handleUpdateStaff : handleAddStaff} disabled={!newStaff.full_name || !newStaff.role}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {editingStaff ? "Update Staff Member" : "Add Staff Member"}
              </button>
              <button onClick={() => { setShowAddModal(false); setEditingStaff(null); }}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
