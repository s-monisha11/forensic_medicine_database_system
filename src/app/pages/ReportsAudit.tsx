import { useState } from "react";
import { Plus, Gavel } from "lucide-react";
import { DataTable } from "../components/DataTable";

const REPORTING_TABLES = [
  "CourtReport", "AuditLog"
];

const mockDataMap: Record<string, any[]> = {
  CourtReport: [{ report_id: 1, created_date: "2026-07-12", status: "Submitted" }],
  AuditLog: [{ audit_id: 1, action_type: "LOGIN", target_table: "UserAccount", action_time: "2026-07-12 09:00:00" }]
};

export function ReportsAudit() {
  const [activeTab, setActiveTab] = useState("CourtReport");
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
            <Gavel className="w-6 h-6 text-primary" /> Reports & Audit
          </h1>
          <p className="text-muted-foreground">Manage court reports and system logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-sm">
          <Plus className="w-4 h-4" /> Add {activeTab}
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex whitespace-nowrap">
            {REPORTING_TABLES.map((tab) => (
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
