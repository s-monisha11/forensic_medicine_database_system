import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { ClipboardList, Microscope, FileText, Calendar, AlertCircle, Clock } from "lucide-react";

const assignedCases = [
  {
    caseId: "CLN-2024-156",
    patientName: "W.M. Silva",
    type: "Clinical",
    assignedDate: "2024-05-27",
    status: "pending",
    priority: "High",
  },
  {
    caseId: "PM-2024-089",
    patientName: "K.D. Fernando",
    type: "Autopsy",
    assignedDate: "2024-05-26",
    status: "in-progress",
    priority: "Medium",
  },
  {
    caseId: "CLN-2024-155",
    patientName: "S.A. Wijesuriya",
    type: "Clinical",
    assignedDate: "2024-05-26",
    status: "completed",
    priority: "Low",
  },
];

const upcomingCourt = [
  { caseId: "PM-2024-067", court: "Colombo High Court", date: "2024-05-29", time: "10:00 AM" },
  { caseId: "CLN-2024-143", court: "Kandy Magistrate", date: "2024-06-02", time: "02:00 PM" },
  { caseId: "PM-2024-078", court: "Galle High Court", date: "2024-06-05", time: "09:30 AM" },
];

const pendingReports = [
  { reportId: "MLR-2024-456", caseRef: "CLN-2024-156", deadline: "2024-05-30", status: "Draft" },
  { reportId: "PMR-2024-234", caseRef: "PM-2024-089", deadline: "2024-05-31", status: "Review" },
  { reportId: "MLR-2024-455", caseRef: "CLN-2024-155", deadline: "2024-06-01", status: "Pending" },
];

export function JMODashboard() {
  const caseColumns = [
    { key: "caseId", header: "Case ID" },
    { key: "patientName", header: "Patient Name" },
    { key: "type", header: "Type" },
    { key: "assignedDate", header: "Assigned Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    {
      key: "priority",
      header: "Priority",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === "High"
              ? "bg-destructive/20 text-destructive"
              : value === "Medium"
              ? "bg-warning/20 text-warning"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Judicial Medical Officer Dashboard</h1>
        <p className="text-muted-foreground">Your assigned cases, reports, and court schedules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Clinical Cases"
          value="12"
          icon={ClipboardList}
          change="3 pending review"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Assigned Autopsy Cases"
          value="8"
          icon={Microscope}
          change="2 in progress"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Pending MLR Reports"
          value="5"
          icon={FileText}
          change="2 due this week"
          changeType="decrease"
          color="yellow"
        />
        <StatCard
          title="Upcoming Court Dates"
          value="3"
          icon={Calendar}
          change="Next: Tomorrow"
          changeType="increase"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-foreground mb-4">Recently Assigned Cases</h3>
          <DataTable columns={caseColumns} data={assignedCases} />
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-card-foreground">Upcoming Court Dates</h3>
            </div>
            <div className="space-y-3">
              {upcomingCourt.map((court, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-card-foreground mb-1">{court.caseId}</p>
                  <p className="text-xs text-muted-foreground">{court.court}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {court.date} at {court.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h3 className="text-card-foreground">Urgent Notifications</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-card-foreground">
                • MLR-2024-456 deadline in 2 days
              </p>
              <p className="text-sm text-card-foreground">
                • Court appearance tomorrow at 10 AM
              </p>
              <p className="text-sm text-card-foreground">
                • PM-2024-089 toxicology results available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-card-foreground mb-4">Pending Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingReports.map((report, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-card-foreground">{report.reportId}</p>
                <StatusBadge status="pending" text={report.status} />
              </div>
              <p className="text-xs text-muted-foreground mb-2">Case: {report.caseRef}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Deadline: {report.deadline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
