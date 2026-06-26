import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Send, Upload, CheckCircle, Calendar } from "lucide-react";

const dispatchQueue = [
  {
    reportId: "MLR-2024-456",
    caseRef: "CLN-2024-156",
    court: "Colombo Magistrate Court",
    dueDate: "2024-05-30",
    status: "pending",
    preparedBy: "Dr. Perera",
  },
  {
    reportId: "PMR-2024-234",
    caseRef: "PM-2024-089",
    court: "Kandy High Court",
    dueDate: "2024-05-31",
    status: "pending",
    preparedBy: "Dr. Jayawardena",
  },
  {
    reportId: "MLR-2024-455",
    caseRef: "CLN-2024-155",
    court: "Galle Magistrate Court",
    dueDate: "2024-06-01",
    status: "completed",
    preparedBy: "Dr. De Silva",
  },
];

const dispatchedReports = [
  {
    reportId: "MLR-2024-450",
    court: "Matara Magistrate",
    dispatchedDate: "2024-05-20",
    receiptStatus: "pending",
    daysWaiting: 8,
  },
  {
    reportId: "PMR-2024-230",
    court: "Colombo High Court",
    dispatchedDate: "2024-05-22",
    receiptStatus: "pending",
    daysWaiting: 6,
  },
  {
    reportId: "MLR-2024-448",
    court: "Kandy Magistrate",
    dispatchedDate: "2024-05-24",
    receiptStatus: "completed",
    daysWaiting: 4,
  },
];

export function CourtDispatch() {
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const queueColumns = [
    { key: "reportId", header: "Report ID" },
    { key: "caseRef", header: "Case Ref" },
    { key: "court", header: "Court" },
    { key: "dueDate", header: "Due Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    { key: "preparedBy", header: "Prepared By" },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <button
          onClick={() => setShowDispatchModal(true)}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
        >
          Dispatch
        </button>
      ),
    },
  ];

  const dispatchedColumns = [
    { key: "reportId", header: "Report ID" },
    { key: "court", header: "Court" },
    { key: "dispatchedDate", header: "Dispatched Date" },
    {
      key: "receiptStatus",
      header: "Receipt Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      key: "daysWaiting",
      header: "Days Waiting",
      render: (value: number) => (
        <span className={value > 7 ? "text-destructive" : "text-muted-foreground"}>{value}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) =>
        row.receiptStatus === "pending" ? (
          <button
            onClick={() => setShowReceiptModal(true)}
            className="px-3 py-1 bg-success text-success-foreground rounded text-xs hover:bg-success/90"
          >
            Upload Receipt
          </button>
        ) : (
          <span className="text-success text-xs">✓ Received</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Court Dispatch Management</h1>
        <p className="text-muted-foreground">Manage report dispatches and receipt confirmations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Dispatch</p>
            <Send className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl text-card-foreground">12</p>
          <p className="text-xs text-muted-foreground mt-1">5 due this week</p>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Dispatched</p>
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl text-card-foreground">45</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Receipt</p>
            <Upload className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-2xl text-card-foreground">7</p>
          <p className="text-xs text-muted-foreground mt-1">2 overdue</p>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <Calendar className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl text-card-foreground">298</p>
          <p className="text-xs text-muted-foreground mt-1">Total this year</p>
        </div>
      </div>

      <div>
        <h3 className="text-foreground mb-4">Dispatch Queue</h3>
        <DataTable columns={queueColumns} data={dispatchQueue} />
      </div>

      <div>
        <h3 className="text-foreground mb-4">Dispatched Reports (Awaiting Receipt)</h3>
        <DataTable columns={dispatchedColumns} data={dispatchedReports} />
      </div>

      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-card-foreground">Dispatch Report</h2>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Report ID</label>
                <input
                  type="text"
                  value="MLR-2024-456"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-card-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Court Name</label>
                <input
                  type="text"
                  value="Colombo Magistrate Court"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-card-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Dispatch Method <span className="text-destructive">*</span>
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
                  <option>Hand Delivery</option>
                  <option>Registered Post</option>
                  <option>Courier Service</option>
                  <option>Email (Official)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Dispatch Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Tracking Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="Enter tracking/reference number"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Confirm Dispatch
              </button>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-card-foreground">Upload Receipt Certificate</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-muted-foreground hover:text-card-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Report ID</label>
                <input
                  type="text"
                  value="MLR-2024-450"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-card-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Receipt Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Court Receipt Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  placeholder="Enter court receipt/acknowledgment number"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Upload Certificate <span className="text-destructive">*</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PDF, JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3">
              <button className="px-6 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors">
                Upload Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
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
