import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, FileText, Printer, Send, Eye } from "lucide-react";

const reports = [
  {
    reportId: "MLR-2024-456",
    caseRef: "CLN-2024-156",
    reportType: "MLR",
    generatedDate: "2024-05-27",
    courtDate: "2024-06-15",
    court: "Colombo Magistrate Court",
    status: "pending",
  },
  {
    reportId: "PMR-2024-234",
    caseRef: "PM-2024-089",
    reportType: "PMR",
    generatedDate: "2024-05-26",
    courtDate: "2024-06-20",
    court: "Kandy High Court",
    status: "completed",
  },
  {
    reportId: "MLR-2024-455",
    caseRef: "CLN-2024-155",
    reportType: "MLR",
    generatedDate: "2024-05-25",
    courtDate: "2024-06-10",
    court: "Galle Magistrate Court",
    status: "approved",
  },
  {
    reportId: "PMR-2024-233",
    caseRef: "PM-2024-088",
    reportType: "PMR",
    generatedDate: "2024-05-24",
    courtDate: "2024-06-08",
    court: "Colombo High Court",
    status: "urgent",
  },
];

export function CourtReports() {
  const [showPreview, setShowPreview] = useState(false);

  const columns = [
    { key: "reportId", header: "Report ID" },
    { key: "caseRef", header: "Case Reference" },
    {
      key: "reportType",
      header: "Report Type",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === "MLR" ? "bg-primary/20 text-primary" : "bg-success/20 text-success"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "generatedDate", header: "Generated Date" },
    { key: "courtDate", header: "Court Date" },
    { key: "court", header: "Court" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="p-1 text-primary hover:bg-primary/10 rounded"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-muted-foreground hover:bg-accent rounded">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Court Report Management</h1>
          <p className="text-muted-foreground">
            Generate and manage medico-legal reports for court proceedings
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
          <p className="text-2xl text-card-foreground">342</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
          <p className="text-2xl text-warning">18</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Dispatched</p>
          <p className="text-2xl text-success">298</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Upcoming Court Dates</p>
          <p className="text-2xl text-destructive">7</p>
        </div>
      </div>

      <DataTable columns={columns} data={reports} />

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-card-foreground mb-4">Report Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Select Case <span className="text-destructive">*</span>
            </label>
            <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
              <option>Select a case</option>
              <option>CLN-2024-156 - W.M. Silva</option>
              <option>PM-2024-089 - K.D. Fernando</option>
              <option>CLN-2024-155 - S.A. Wijesuriya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Report Type <span className="text-destructive">*</span>
            </label>
            <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
              <option>Select report type</option>
              <option>Medico-Legal Report (MLR)</option>
              <option>Post-Mortem Report (PMR)</option>
              <option>Certificate of Death</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Court Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Enter court name"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Court Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-muted-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              rows={4}
              placeholder="Enter any additional notes for the report..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors">
            <Send className="w-4 h-4" />
            Dispatch
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-card-foreground">Report Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-8 bg-white text-gray-900">
              <div className="text-center mb-8">
                <h2 className="text-xl mb-2">MEDICO-LEGAL REPORT</h2>
                <p className="text-sm text-gray-600">University of Sri Lanka</p>
                <p className="text-sm text-gray-600">Department of Forensic Medicine</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Report No:</strong> MLR-2024-456
                  </div>
                  <div>
                    <strong>Date:</strong> 27th May 2024
                  </div>
                  <div>
                    <strong>Case Reference:</strong> CLN-2024-156
                  </div>
                  <div>
                    <strong>Police Station:</strong> Colombo Central
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <h3 className="mb-2">Patient Information</h3>
                  <p>
                    <strong>Name:</strong> W.M. Silva
                  </p>
                  <p>
                    <strong>Age:</strong> 35 years
                  </p>
                  <p>
                    <strong>Gender:</strong> Male
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <h3 className="mb-2">Examination Findings</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The patient was examined on 27th May 2024 at 10:30 AM. Multiple contusions
                    were observed on the upper limbs, consistent with blunt force trauma. No
                    fractures were detected upon radiological examination. The injuries are
                    approximately 24-48 hours old based on the degree of healing observed.
                  </p>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <h3 className="mb-2">Opinion</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The injuries observed are consistent with the history provided and could have
                    been caused by blunt force trauma. Further investigation is recommended.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-300">
                  <p className="mb-8">
                    <strong>Examining Officer:</strong> Dr. Sunil Perera
                  </p>
                  <p>
                    <strong>Signature:</strong> ___________________________
                  </p>
                  <p className="text-xs text-gray-600 mt-4">
                    This report is issued for official use only
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Printer className="w-4 h-4" />
                Print Report
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
