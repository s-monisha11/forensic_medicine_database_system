import { useState } from "react";
import { Plus, Activity } from "lucide-react";
import { DataTable } from "../components/DataTable";

const MEDICAL_TABLES = [
  "Examination", "Injury", "Postmortem", "CauseOfDeath"
];

const mockDataMap: Record<string, any[]> = {
  Examination: [{ examination_id: 1, exam_date: "2026-07-10", findings_summary: "Multiple contusions" }],
  Injury: [{ injury_id: 1, injury_type: "Contusion", body_location: "Left Arm", severity: "Moderate" }],
  Postmortem: [{ postmortem_id: 1, autopsy_date: "2026-07-11", summary: "Completed external exam" }],
  CauseOfDeath: [{ cod_id: 1, immediate_cause: "Asphyxia", manner_of_death: "Pending Investigation" }]
};

export function MedicalPostmortem() {
  const [activeTab, setActiveTab] = useState("Examination");
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
            <Activity className="w-6 h-6 text-primary" /> Medical & Postmortem
          </h1>
          <p className="text-muted-foreground">Manage examinations and medical records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm">
          <Plus className="w-4 h-4" /> Add {activeTab}
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {MEDICAL_TABLES.map((tab) => (
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
