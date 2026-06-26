import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { UserPlus, Send, FileCheck, Calendar } from "lucide-react";

const recentRegistrations = [
  { date: "2024-05-28", patientName: "W.M. Silva", nic: "923456789V", type: "Clinical", status: "completed" },
  { date: "2024-05-28", patientName: "L.K. Fernando", nic: "881234567V", type: "Clinical", status: "completed" },
  { date: "2024-05-27", patientName: "S.P. Jayasuriya", nic: "905678901V", type: "Autopsy", status: "completed" },
];

const pendingDispatches = [
  { reportId: "MLR-2024-456", court: "Colombo Magistrate", dueDate: "2024-05-30", status: "pending" },
  { reportId: "PMR-2024-234", court: "Kandy High Court", dueDate: "2024-05-31", status: "pending" },
  { reportId: "MLR-2024-455", court: "Galle Magistrate", dueDate: "2024-06-01", status: "completed" },
];

const pendingReceipts = [
  { reportId: "MLR-2024-450", court: "Matara Magistrate", sentDate: "2024-05-20", status: "pending" },
  { reportId: "PMR-2024-230", court: "Colombo High Court", sentDate: "2024-05-22", status: "pending" },
];

export function ClericalDashboard() {
  const regColumns = [
    { key: "date", header: "Date" },
    { key: "patientName", header: "Patient Name" },
    { key: "nic", header: "NIC" },
    { key: "type", header: "Type" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
  ];

  const dispatchColumns = [
    { key: "reportId", header: "Report ID" },
    { key: "court", header: "Court" },
    { key: "dueDate", header: "Due Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Clerical Officer Dashboard</h1>
        <p className="text-muted-foreground">Manage registrations, dispatches, and records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Registrations"
          value="8"
          icon={UserPlus}
          change="2 clinical, 1 autopsy"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Pending Dispatches"
          value="12"
          icon={Send}
          change="5 due this week"
          changeType="decrease"
          color="yellow"
        />
        <StatCard
          title="Pending Receipts"
          value="7"
          icon={FileCheck}
          change="2 overdue"
          changeType="decrease"
          color="red"
        />
        <StatCard
          title="Completed Today"
          value="15"
          icon={Calendar}
          change="Above average"
          changeType="increase"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-foreground mb-4">Today's Registrations</h3>
          <DataTable columns={regColumns} data={recentRegistrations} />

          <div className="mt-4 bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="text-card-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                Register New Patient
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                Register New Case
              </button>
              <button className="w-full px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                Search Records
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <h3 className="text-card-foreground mb-4">Pending Dispatches</h3>
            <div className="space-y-3">
              {pendingDispatches.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-card-foreground">{item.reportId}</p>
                    <StatusBadge status={item.status as any} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{item.court}</p>
                  <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <h3 className="text-card-foreground mb-4">Pending Receipt Uploads</h3>
            <div className="space-y-3">
              {pendingReceipts.map((item, index) => (
                <div key={index} className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-sm text-card-foreground mb-1">{item.reportId}</p>
                  <p className="text-xs text-muted-foreground mb-2">{item.court}</p>
                  <p className="text-xs text-warning">Sent: {item.sentDate} - Receipt pending</p>
                  <button className="mt-2 text-xs text-primary hover:underline">
                    Upload Certificate →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-card-foreground mb-4">This Week's Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl text-card-foreground mb-1">42</p>
            <p className="text-xs text-muted-foreground">Total Registrations</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl text-card-foreground mb-1">28</p>
            <p className="text-xs text-muted-foreground">Reports Dispatched</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl text-card-foreground mb-1">15</p>
            <p className="text-xs text-muted-foreground">Receipts Uploaded</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-2xl text-card-foreground mb-1">156</p>
            <p className="text-xs text-muted-foreground">Record Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
