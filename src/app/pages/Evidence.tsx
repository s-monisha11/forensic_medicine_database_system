import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Plus, Image, MapPin, Clock } from "lucide-react";

const evidenceItems = [
  {
    evidenceId: "EV-2024-345",
    caseRef: "PM-2024-089",
    type: "Physical Evidence",
    description: "Bloodstained clothing",
    location: "Evidence Room A - Shelf 12",
    collectedDate: "2024-05-26",
    status: "completed",
  },
  {
    evidenceId: "EV-2024-344",
    caseRef: "CLN-2024-156",
    type: "Photographic",
    description: "Injury documentation photos",
    location: "Digital Archive",
    collectedDate: "2024-05-27",
    status: "pending",
  },
  {
    evidenceId: "EV-2024-343",
    caseRef: "PM-2024-088",
    type: "Biological Sample",
    description: "Blood sample for toxicology",
    location: "Lab Refrigeration Unit 3",
    collectedDate: "2024-05-25",
    status: "in-progress",
  },
  {
    evidenceId: "EV-2024-342",
    caseRef: "PM-2024-087",
    type: "Documents",
    description: "Suicide note",
    location: "Evidence Room B - Cabinet 5",
    collectedDate: "2024-05-24",
    status: "completed",
  },
];

const chainOfCustody = [
  {
    timestamp: "2024-05-26 09:15 AM",
    action: "Evidence Collected",
    person: "Dr. Sunil Perera",
    location: "Crime Scene",
  },
  {
    timestamp: "2024-05-26 11:30 AM",
    action: "Transferred to Lab",
    person: "Lab Technician K. Silva",
    location: "Forensic Laboratory",
  },
  {
    timestamp: "2024-05-26 02:45 PM",
    action: "Analysis Completed",
    person: "Dr. R. Jayawardena",
    location: "Forensic Laboratory",
  },
  {
    timestamp: "2024-05-26 04:00 PM",
    action: "Stored in Evidence Room",
    person: "Evidence Clerk",
    location: "Evidence Room A",
  },
];

export function Evidence() {
  const columns = [
    { key: "evidenceId", header: "Evidence ID" },
    { key: "caseRef", header: "Case Reference" },
    { key: "type", header: "Type" },
    { key: "description", header: "Description" },
    { key: "location", header: "Storage Location" },
    { key: "collectedDate", header: "Collected Date" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2">Evidence Management</h1>
          <p className="text-muted-foreground">Track and manage forensic evidence</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Evidence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Evidence Items</p>
          <p className="text-2xl text-card-foreground">1,248</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Storage</p>
          <p className="text-2xl text-success">1,156</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Analysis</p>
          <p className="text-2xl text-primary">45</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">At Court</p>
          <p className="text-2xl text-warning">47</p>
        </div>
      </div>

      <DataTable columns={columns} data={evidenceItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-card-foreground mb-4">Chain of Custody - EV-2024-345</h3>
          <div className="space-y-4">
            {chainOfCustody.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  {index < chainOfCustody.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground">{entry.timestamp}</p>
                  <p className="text-card-foreground mb-1">{entry.action}</p>
                  <p className="text-sm text-muted-foreground">By: {entry.person}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    {entry.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-card-foreground mb-4">Evidence Gallery</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer"
              >
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors">
            Upload More Photos
          </button>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-card-foreground mb-3">Barcode/QR Code</h4>
            <div className="bg-muted rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">▮▮ ▮ ▮▮▮ ▮ ▮▮</div>
              <p className="text-sm text-muted-foreground">EV-2024-345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
