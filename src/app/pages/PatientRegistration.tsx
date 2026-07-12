import { useState, useEffect } from "react";
import { Save, RotateCcw, Search, Upload, User, X, Trash2 } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { api } from "../../services/api";

export function PatientRegistration() {
  const [formData, setFormData] = useState({
    full_name: "",
    nic: "",
    age: "",
    gender: "",
    address: "",
    contact_no: "",
    hospital_bht: "",
    ward: "",
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    setLoading(true);
    try {
      const data = await api.getPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || "Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await api.updatePatient(editId, formData);
        setSuccessMessage("Patient updated successfully!");
      } else {
        await api.addPatient(formData);
        setSuccessMessage("Patient registered successfully!");
      }
      setShowSuccess(true);
      handleReset();
      loadPatients();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  };

  const handleReset = () => {
    setEditId(null);
    setFormData({
      full_name: "",
      nic: "",
      age: "",
      gender: "",
      address: "",
      contact_no: "",
      hospital_bht: "",
      ward: "",
    });
  };

  const handleEdit = (patient: any) => {
    setEditId(patient.patient_id);
    setFormData({
      full_name: patient.full_name || "",
      nic: patient.nic || "",
      age: String(patient.age || ""),
      gender: patient.gender || "",
      address: patient.address || "",
      contact_no: patient.contact_no || "",
      hospital_bht: patient.hospital_bht || "",
      ward: patient.ward || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return;
    try {
      await api.deletePatient(id);
      setSuccessMessage("Patient deleted successfully!");
      setShowSuccess(true);
      loadPatients();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete patient.");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const filteredPatients = showSearchResults
    ? patients.filter(
        (p) =>
          (p.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.nic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.hospital_bht || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const columns = [
    { key: "patient_id", header: "Patient ID" },
    { key: "full_name", header: "Full Name" },
    { key: "nic", header: "NIC" },
    { key: "age", header: "Age" },
    { key: "gender", header: "Gender" },
    { key: "contact_no", header: "Contact No" },
    { key: "hospital_bht", header: "BHT Number" },
    { key: "ward", header: "Ward" },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.patient_id)}
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
            <div className="bg-success rounded-full p-1">
              <User className="w-4 h-4 text-success-foreground" />
            </div>
            <p className="text-success">{successMessage}</p>
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
          <h1 className="text-foreground mb-2">Patient Registration</h1>
          <p className="text-muted-foreground">Register new patient or search existing records</p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Search by name, NIC, or BHT..."
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
          {showSearchResults && (
            <button
              onClick={() => {
                setShowSearchResults(false);
                setSearchQuery("");
              }}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-card-foreground mb-4">
          {editId ? "Update Patient Record" : "Register New Patient"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-card-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">NIC Number</label>
              <input
                type="text"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter NIC number"
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">
                Age <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter age"
                required
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">
                Gender <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-card-foreground mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter address"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">Contact Number</label>
              <input
                type="tel"
                value={formData.contact_no}
                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">Hospital BHT Number</label>
              <input
                type="text"
                value={formData.hospital_bht}
                onChange={(e) => setFormData({ ...formData, hospital_bht: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter BHT number"
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">Ward</label>
              <input
                type="text"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter ward"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {editId ? "Update Patient" : "Save Patient"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-foreground mb-4">
          {showSearchResults ? `Search Results (${filteredPatients.length})` : "Registered Patients"}
        </h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground animate-pulse">Loading patients...</div>
        ) : (
          <DataTable columns={columns} data={filteredPatients} />
        )}
      </div>
    </div>
  );
}
