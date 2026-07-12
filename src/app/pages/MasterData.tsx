import { useState } from "react";
import { Plus, Database } from "lucide-react";
import { DataTable } from "../components/DataTable";

const REFERENCE_TABLES = [
  "Person", "CaseType", "CaseStatus", "PoliceStation", "Court", "Department", 
  "StaffRole", "UserRole", "ExaminationType", "EvidenceType", "LabTest", 
  "ReportType", "ReportStatus"
];

// Mock data generator for reference tables
const mockDataMap: Record<string, any[]> = {
  Person: [{ id: 1, full_name: "John Doe", nic_passport: "123456789V", gender: "Male", phone: "0771234567" }],
  CaseType: [{ id: 1, type_name: "Clinical", description: "Clinical Examination" }, { id: 2, type_name: "Autopsy", description: "Postmortem Examination" }],
  CaseStatus: [{ id: 1, status_name: "Pending", description: "Case is pending" }, { id: 2, status_name: "Closed", description: "Case is closed" }],
  PoliceStation: [{ id: 1, station_name: "Colombo Central", contact_no: "0112345678", area: "Colombo" }],
  Court: [{ id: 1, court_name: "High Court Colombo", court_type: "High Court", location: "Colombo" }],
  Department: [{ id: 1, department_name: "Forensic Medicine", office_location: "Main Building" }],
  StaffRole: [{ id: 1, role_name: "JMO", description: "Judicial Medical Officer" }],
  UserRole: [{ id: 1, role_name: "Admin", permission_level: 1 }],
  ExaminationType: [{ id: 1, type_name: "External", description: "External Examination" }],
  EvidenceType: [{ id: 1, type_name: "Biological", description: "Blood, Tissue, etc." }],
  LabTest: [{ id: 1, test_name: "Toxicology Screen", lab_section: "Toxicology", description: "Basic tox screen" }],
  ReportType: [{ id: 1, type_name: "Postmortem Report", description: "PMR" }],
  ReportStatus: [{ id: 1, status_name: "Draft", description: "Report in draft state" }]
};

export function MasterData() {
  const [activeTab, setActiveTab] = useState("Person");

  const activeData = mockDataMap[activeTab] || [];
  
  // Dynamically generate columns based on the mock data keys
  const columns = activeData.length > 0 
    ? Object.keys(activeData[0]).map(key => ({
        key,
        header: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }))
    : [{ key: "id", header: "ID" }, { key: "name", header: "Name" }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" /> 
            Master Data Management
          </h1>
          <p className="text-muted-foreground">Manage all 13 reference tables here</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add New {activeTab}
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {REFERENCE_TABLES.map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 capitalize transition-colors flex-shrink-0 ${activeTab === tab ? "text-primary border-b-2 border-primary bg-accent/50" : "text-muted-foreground hover:text-card-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-card-foreground mb-4">{activeTab} Table Records</h3>
          {activeData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No records found for {activeTab}.</div>
          ) : (
            <DataTable columns={columns} data={activeData} />
          )}
        </div>
      </div>
    </div>
  );
}
