import { useState } from "react";
import { Save, RotateCcw, Search, Upload, User, X } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";

interface Patient {
  id: string;
  fullName: string;
  nic: string;
  age: string;
  gender: string;
  address: string;
  contactNumber: string;
  hospitalBHT: string;
  ward: string;
  registeredDate: string;
  status: string;
}

export function PatientRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    age: "",
    gender: "",
    address: "",
    contactNumber: "",
    hospitalBHT: "",
    ward: "",
  });

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P-001",
      fullName: "W.M. Silva",
      nic: "923456789V",
      age: "35",
      gender: "Male",
      address: "123 Main St, Colombo",
      contactNumber: "+94 77 123 4567",
      hospitalBHT: "BHT-2024-001",
      ward: "Ward 5",
      registeredDate: "2024-05-27",
      status: "completed",
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient: Patient = {
      id: `P-${String(patients.length + 1).padStart(3, "0")}`,
      ...formData,
      registeredDate: new Date().toISOString().split("T")[0],
      status: "completed",
    };

    setPatients([newPatient, ...patients]);
    setShowSuccess(true);
    handleReset();

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      nic: "",
      age: "",
      gender: "",
      address: "",
      contactNumber: "",
      hospitalBHT: "",
      ward: "",
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const filteredPatients = showSearchResults
    ? patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.hospitalBHT.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const columns = [
    { key: "id", header: "Patient ID" },
    { key: "fullName", header: "Full Name" },
    { key: "nic", header: "NIC" },
    { key: "age", header: "Age" },
    { key: "gender", header: "Gender" },
    { key: "hospitalBHT", header: "BHT Number" },
    { key: "registeredDate", header: "Registered Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
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
            <p className="text-success">Patient registered successfully!</p>
          </div>
          <button onClick={() => setShowSuccess(false)}>
            <X className="w-4 h-4 text-success" />
          </button>
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
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-card-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">
                NIC Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter NIC number"
                required
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background text-card-foreground"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-card-foreground mb-2">Hospital BHT Number</label>
              <input
                type="text"
                value={formData.hospitalBHT}
                onChange={(e) => setFormData({ ...formData, hospitalBHT: e.target.value })}
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

          <div className="border-t border-border pt-6">
            <h3 className="text-card-foreground mb-4">Upload Documents</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Patient
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
          {showSearchResults ? `Search Results (${filteredPatients.length})` : "Recently Registered Patients"}
        </h3>
        <DataTable columns={columns} data={filteredPatients} />
      </div>
    </div>
  );
}
