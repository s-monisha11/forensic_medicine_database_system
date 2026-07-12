import { useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { DataTable } from "../components/DataTable";

const CASE_TABLES = [
  "MedicalLegalCase", "CaseReference", "Incident", "Staff", 
  "UserAccount", "StaffCaseAssignment", "WitnessStatement", "Attachment"
];

const mockDataMap: Record<string, any[]> = {
  MedicalLegalCase: [{ case_id: 1, case_number: "MLC-2026-001", admission_date: "2026-07-10" }],
  CaseReference: [{ reference_id: 1, police_ref_no: "POL-001", court_ref_no: "CRT-001" }],
  Incident: [{ incident_id: 1, incident_date: "2026-07-09", location: "Colombo" }],
  Staff: [{ staff_id: 1, full_name: "Dr. Smith", registration_no: "REG123" }],
  UserAccount: [{ user_id: 1, username: "admin", is_active: true }],
  StaffCaseAssignment: [{ assignment_id: 1, assigned_date: "2026-07-10", responsibility: "Lead Medical Officer" }],
  WitnessStatement: [{ statement_id: 1, witness_name: "Jane Doe", statement_date: "2026-07-11" }],
  Attachment: [{ attachment_id: 1, file_name: "report.pdf", file_type: "PDF" }]
};

export function CaseOperations() {
  const [activeTab, setActiveTab] = useState("MedicalLegalCase");
  const activeData = mockDataMap[activeTab] || [];
  
  const columns = activeData.length > 0 
    ? Object.keys(activeData[0]).map(key => ({
        key, header: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }))
    : [{ key: "id", header: "ID" }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Case & Core Operations
          </h1>
          <p className="text-muted-foreground">Manage core cases and personnel</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm">
          <Plus className="w-4 h-4" /> Add {activeTab}
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {CASE_TABLES.map((tab) => (
              <button 
                key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 transition-colors flex-shrink-0 ${activeTab === tab ? "text-primary border-b-2 border-primary bg-accent/50" : "text-muted-foreground hover:text-card-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-card-foreground mb-4">{activeTab} Records</h3>
          <DataTable columns={columns} data={activeData} />
        </div>
      </div>
    </div>
  );
}
