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
  Person: [],
  CaseType: [],
  CaseStatus: [],
  PoliceStation: [],
  Court: [],
  Department: [],
  StaffRole: [],
  UserRole: [],
  ExaminationType: [],
  EvidenceType: [],
  LabTest: [],
  ReportType: [],
  ReportStatus: []
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
