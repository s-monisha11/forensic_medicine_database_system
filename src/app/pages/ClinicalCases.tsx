import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, FileText, Upload, Eye, X, CheckCircle } from "lucide-react";

interface ClinicalCase {
  caseRef: string;
  mlefNo: string;
  patientName: string;
  examDate: string;
  policeStation: string;
  injuryType: string;
  status: string;
}

export function ClinicalCases() {
  const [cases, setCases] = useState<ClinicalCase[]>([
    {
      caseRef: "CLN-2024-156",
      mlefNo: "MLEF-2024-789",
      patientName: "W.M. Silva",
      examDate: "2024-05-27",
      policeStation: "Colombo Central",
      injuryType: "Blunt Force Trauma",
      status: "pending",
    },
    {
      caseRef: "CLN-2024-155",
      mlefNo: "MLEF-2024-788",
      patientName: "S.A. Wijesuriya",
      examDate: "2024-05-26",
      policeStation: "Kandy",
      injuryType: "Poisoning Suspected",
      status: "in_progress",
    },
    {
      caseRef: "CLN-2024-154",
      mlefNo: "MLEF-2024-787",
      patientName: "R.K. Mendis",
      examDate: "2024-05-25",
      policeStation: "Galle",
      injuryType: "Sharp Weapon",
      status: "completed",
    },
    {
      caseRef: "CLN-2024-153",
      mlefNo: "MLEF-2024-786",
      patientName: "N.P. Gunasekara",
      examDate: "2024-05-24",
      policeStation: "Matara",
      injuryType: "Firearm Injury",
      status: "urgent",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCase, setNewCase] = useState({
    patientName: "",
    examDate: "",
    policeStation: "",
    injuryType: "",
    notes: "",
  });

  const handleAddCase = () => {
    const caseNumber = cases.length + 1;
    const clinicalCase: ClinicalCase = {
      caseRef: `CLN-2024-${String(156 - caseNumber + 1).padStart(3, "0")}`,
      mlefNo: `MLEF-2024-${String(789 - caseNumber + 1).padStart(3, "0")}`,
      patientName: newCase.patientName,
      examDate: newCase.examDate,
      policeStation: newCase.policeStation,
      injuryType: newCase.injuryType,
      status: "pending",
    };

    setCases([clinicalCase, ...cases]);
    setShowAddModal(false);
    setShowSuccess(true);
    setNewCase({ patientName: "", examDate: "", policeStation: "", injuryType: "", notes: "" });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const columns = [
    { key: "caseRef", header: "Case Reference" },
    { key: "mlefNo", header: "MLEF Number" },
    { key: "patientName", header: "Patient Name" },
    { key: "examDate", header: "Exam Date" },
    { key: "policeStation", header: "Police Station" },
    { key: "injuryType", header: "Type of Injury" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
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
          <p className="text-2xl text-card-foreground">423</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl text-warning">28</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl text-primary">15</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl text-success">380</p>
        </div>
      </div>

      <DataTable columns={columns} data={cases} />

      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Clinical Case Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Case Reference</p>
                  <p className="text-card-foreground">{selectedCase.caseRef}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MLEF Number</p>
                  <p className="text-card-foreground">{selectedCase.mlefNo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p className="text-card-foreground">{selectedCase.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Examination Date</p>
                  <p className="text-card-foreground">{selectedCase.examDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Police Station</p>
                  <p className="text-card-foreground">{selectedCase.policeStation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedCase.status} />
                </div>
              </div>

              <div>
                <h3 className="text-card-foreground mb-3">Investigation Details</h3>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-card-foreground mb-2">
                    <strong>Type of Injury:</strong> {selectedCase.injuryType}
                  </p>
                  <p className="text-sm text-card-foreground mb-2">
                    <strong>Nature of Weapon:</strong> Blunt object (suspected)
                  </p>
                  <p className="text-sm text-card-foreground">
                    <strong>Doctor Notes:</strong> Patient presented with multiple contusions on
                    the upper limbs. X-ray examination revealed no fractures. Further observation
                    required.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-card-foreground mb-3">Evidence</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center"
                    >
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Evidence {i}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Create New Clinical Case</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCase({ patientName: "", examDate: "", policeStation: "", injuryType: "", notes: "" });
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
                    Patient Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCase.patientName}
                    onChange={(e) => setNewCase({ ...newCase, patientName: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Examination Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={newCase.examDate}
                    onChange={(e) => setNewCase({ ...newCase, examDate: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Police Station <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCase.policeStation}
                    onChange={(e) => setNewCase({ ...newCase, policeStation: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    placeholder="Enter police station"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Type of Injury <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={newCase.injuryType}
                    onChange={(e) => setNewCase({ ...newCase, injuryType: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  >
                    <option value="">Select injury type</option>
                    <option>Blunt Force Trauma</option>
                    <option>Sharp Weapon</option>
                    <option>Firearm Injury</option>
                    <option>Poisoning Suspected</option>
                    <option>Burn Injury</option>
                    <option>Sexual Assault</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-muted-foreground mb-2">Notes</label>
                  <textarea
                    value={newCase.notes}
                    onChange={(e) => setNewCase({ ...newCase, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                    rows={4}
                    placeholder="Enter initial findings or notes..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={handleAddCase}
                disabled={
                  !newCase.patientName ||
                  !newCase.examDate ||
                  !newCase.policeStation ||
                  !newCase.injuryType
                }
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Case
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCase({ patientName: "", examDate: "", policeStation: "", injuryType: "", notes: "" });
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
