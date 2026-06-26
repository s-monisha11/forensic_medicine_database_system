import { StatCard } from "../../components/StatCard";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { ClipboardList, Microscope, Upload, CheckCircle } from "lucide-react";

const assignedCases = [
  {
    caseId: "CLN-2024-154",
    patientName: "R.K. Mendis",
    type: "Clinical",
    assignedDate: "2024-05-25",
    status: "in-progress",
    findings: "Pending",
  },
  {
    caseId: "PM-2024-087",
    patientName: "A.S. Perera",
    type: "Autopsy",
    assignedDate: "2024-05-24",
    status: "completed",
    findings: "Submitted",
  },
  {
    caseId: "CLN-2024-153",
    patientName: "N.P. Gunasekara",
    type: "Clinical",
    assignedDate: "2024-05-24",
    status: "pending",
    findings: "Not Started",
  },
];

const recentFindings = [
  { caseId: "PM-2024-087", finding: "Completed internal examination", timestamp: "2 hours ago" },
  { caseId: "CLN-2024-154", finding: "Uploaded injury photographs", timestamp: "5 hours ago" },
  { caseId: "CLN-2024-152", finding: "Submitted examination report", timestamp: "1 day ago" },
];

export function MedicalOfficerDashboard() {
  const columns = [
    { key: "caseId", header: "Case ID" },
    { key: "patientName", header: "Patient Name" },
    { key: "type", header: "Type" },
    { key: "assignedDate", header: "Assigned Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    { key: "findings", header: "Findings Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Medical Officer Dashboard</h1>
        <p className="text-muted-foreground">Your assigned cases and examination findings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Cases"
          value="15"
          icon={ClipboardList}
          change="3 new this week"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="In Progress"
          value="6"
          icon={Microscope}
          change="Active examinations"
          changeType="increase"
          color="yellow"
        />
        <StatCard
          title="Completed Today"
          value="4"
          icon={CheckCircle}
          change="+2 from yesterday"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Pending Upload"
          value="3"
          icon={Upload}
          change="Reports to submit"
          changeType="decrease"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-foreground mb-4">Assigned Cases</h3>
          <DataTable columns={columns} data={assignedCases} />
        </div>

        <div>
          <div className="bg-card rounded-lg p-4 border border-border shadow-sm mb-4">
            <h3 className="text-card-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentFindings.map((item, index) => (
                <div key={index} className="border-l-2 border-primary pl-3">
                  <p className="text-sm text-card-foreground">{item.finding}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.caseId} • {item.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="text-card-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                Add Examination Findings
              </button>
              <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                Upload Evidence Photos
              </button>
              <button className="w-full px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                View My Cases
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-card-foreground mb-4">Today's Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">09:00 AM</p>
            <p className="text-card-foreground">Clinical Examination - CLN-2024-154</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">02:00 PM</p>
            <p className="text-card-foreground">Autopsy Assistance - PM-2024-090</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">04:00 PM</p>
            <p className="text-card-foreground">Report Review Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
