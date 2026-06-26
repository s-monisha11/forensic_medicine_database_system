import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Edit, Trash2, Shield, Activity, X, CheckCircle } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  lastActive: string;
}

const activityLogs = [
  {
    user: "Dr. Sunil Perera",
    action: "Generated MLR Report",
    caseRef: "CLN-2024-156",
    timestamp: "2024-05-28 10:30 AM",
  },
  {
    user: "Dr. Ranil Jayawardena",
    action: "Completed Autopsy Examination",
    caseRef: "PM-2024-089",
    timestamp: "2024-05-28 09:15 AM",
  },
  {
    user: "K. Mendis",
    action: "Updated Patient Records",
    caseRef: "CLN-2024-155",
    timestamp: "2024-05-28 08:45 AM",
  },
];

export function Staff() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "Dr. Sunil Perera",
      role: "Judicial Medical Officer",
      email: "s.perera@forensic.lk",
      phone: "+94 77 123 4567",
      status: "approved",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Dr. Ranil Jayawardena",
      role: "Medical Officer",
      email: "r.jayawardena@forensic.lk",
      phone: "+94 77 234 5678",
      status: "approved",
      lastActive: "5 hours ago",
    },
    {
      id: "3",
      name: "Dr. Nisha De Silva",
      role: "Medical Officer",
      email: "n.desilva@forensic.lk",
      phone: "+94 77 345 6789",
      status: "approved",
      lastActive: "1 day ago",
    },
    {
      id: "4",
      name: "K. Mendis",
      role: "Clerical Officer",
      email: "k.mendis@forensic.lk",
      phone: "+94 77 456 7890",
      status: "approved",
      lastActive: "3 hours ago",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleAddStaff = () => {
    const staff: StaffMember = {
      id: String(staffMembers.length + 1),
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
      phone: newStaff.phone,
      status: "approved",
      lastActive: "Just now",
    };

    setStaffMembers([...staffMembers, staff]);
    setShowAddModal(false);
    setShowSuccess(true);
    setNewStaff({ name: "", role: "", email: "", phone: "", username: "", password: "" });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDeleteStaff = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaffMembers(staffMembers.filter((s) => s.id !== id));
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      username: "",
      password: "",
    });
    setShowAddModal(true);
  };

  const handleUpdateStaff = () => {
    if (editingStaff) {
      setStaffMembers(
        staffMembers.map((s) =>
          s.id === editingStaff.id
            ? { ...s, name: newStaff.name, role: newStaff.role, email: newStaff.email, phone: newStaff.phone }
            : s
        )
      );
      setEditingStaff(null);
      setShowAddModal(false);
      setShowSuccess(true);
      setNewStaff({ name: "", role: "", email: "", phone: "", username: "", password: "" });

      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    { key: "lastActive", header: "Last Active" },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: StaffMember) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditStaff(row)}
            className="p-1 text-primary hover:bg-primary/10 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteStaff(row.id)}
            className="p-1 text-destructive hover:bg-destructive/10 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <p className="text-success">
              Staff member {editingStaff ? "updated" : "added"} successfully!
            </p>
          </div>
          <button onClick={() => setShowSuccess(false)}>
            <X className="w-4 h-4 text-success" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage staff, roles, and access permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Staff</p>
          <p className="text-2xl text-card-foreground">28</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Doctors</p>
          <p className="text-2xl text-primary">12</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Clerical Staff</p>
          <p className="text-2xl text-success">15</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Active Today</p>
          <p className="text-2xl text-warning">18</p>
        </div>
      </div>

      <DataTable columns={columns} data={staffMembers} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-card-foreground">Role Permissions</h3>
          </div>
          <div className="space-y-3">
            {[
              { role: "Judicial Medical Officer", permissions: "Full Access" },
              { role: "Medical Officer", permissions: "Case Management, Reports" },
              { role: "Clerical Officer", permissions: "Data Entry, Records" },
              { role: "System Administrator", permissions: "All Permissions" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="text-sm text-card-foreground">{item.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.permissions}</p>
                </div>
                <button className="text-primary hover:text-primary/80">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-success" />
            <h3 className="text-card-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {activityLogs.map((log, index) => (
              <div key={index} className="border-l-2 border-primary pl-4 pb-3">
                <p className="text-sm text-card-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  By {log.user} • {log.caseRef}
                </p>
                <p className="text-xs text-muted-foreground">{log.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-card-foreground">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                  setNewStaff({ name: "", role: "", email: "", phone: "", username: "", password: "" });
                }}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Role <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  >
                    <option value="">Select role</option>
                    <option>Judicial Medical Officer</option>
                    <option>Medical Officer</option>
                    <option>Clerical Officer</option>
                    <option>System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    placeholder="Enter phone number"
                  />
                </div>

                {!editingStaff && (
                  <>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Username</label>
                      <input
                        type="text"
                        value={newStaff.username}
                        onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Initial Password
                      </label>
                      <input
                        type="password"
                        value={newStaff.password}
                        onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        placeholder="Enter initial password"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={editingStaff ? handleUpdateStaff : handleAddStaff}
                disabled={!newStaff.name || !newStaff.role || !newStaff.email}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingStaff ? "Update Staff Member" : "Add Staff Member"}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                  setNewStaff({ name: "", role: "", email: "", phone: "", username: "", password: "" });
                }}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
