import { useState } from "react";
import { Plus, Microscope } from "lucide-react";
import { DataTable } from "../components/DataTable";

const EVIDENCE_TABLES = [
  "EvidenceItem", "BiologicalSample", "ChainOfCustody", "TestRequest", "TestResult"
];

const mockDataMap: Record<string, any[]> = {
  EvidenceItem: [{ evidence_id: 1, evidence_code: "EV-001", storage_location: "Locker A" }],
  BiologicalSample: [{ sample_id: 1, sample_code: "BS-001", sample_type: "Blood" }],
  ChainOfCustody: [{ custody_id: 1, transfer_datetime: "2026-07-11 10:00", remarks: "Handed to Lab" }],
  TestRequest: [{ request_id: 1, request_date: "2026-07-12" }],
  TestResult: [{ result_id: 1, result_text: "Positive", status: "Verified" }]
};

export function EvidenceLab() {
  const [activeTab, setActiveTab] = useState("EvidenceItem");
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
            <Microscope className="w-6 h-6 text-primary" /> Evidence & Laboratory
          </h1>
          <p className="text-muted-foreground">Manage evidence, samples, and lab tests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm">
          <Plus className="w-4 h-4" /> Add {activeTab}
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {EVIDENCE_TABLES.map((tab) => (
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
