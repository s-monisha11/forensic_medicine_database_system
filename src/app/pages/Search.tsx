import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Search as SearchIcon, Filter, Download } from "lucide-react";
import { api } from "../../services/api";

export function Search() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    caseNumber: "", patientName: "", nic: "", policeStation: "",
    caseType: "", reportStatus: "", startDate: "", endDate: "", doctor: "",
  });

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = {};
      const q = [filters.caseNumber, filters.patientName, filters.nic, filters.policeStation].filter(Boolean).join(" ");
      if (q) params.q = q;
      if (filters.caseType) params.case_type = filters.caseType;
      if (filters.reportStatus) params.status = filters.reportStatus;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.doctor) params.doctor = filters.doctor;

      const results = await api.searchCases(params);
      setSearchResults(results);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      caseNumber: "", patientName: "", nic: "", policeStation: "",
      caseType: "", reportStatus: "", startDate: "", endDate: "", doctor: "",
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleExport = () => {
    if (searchResults.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = Object.keys(searchResults[0]).join(",");
    csvContent += headers + "\r\n";
    searchResults.forEach((row: any) => {
      const rowData = Object.values(row).map((val) => `"${String(val || "").replace(/"/g, '""')}"`).join(",");
      csvContent += rowData + "\r\n";
    });
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Search_Results_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusMap: Record<string, string> = {
    Pending: "pending", "In Progress": "in_progress", Completed: "completed", Urgent: "urgent", Closed: "completed",
  };

  const columns = [
    { key: "case_number", header: "Case ID" },
    { key: "patient_name", header: "Patient Name" },
    { key: "nic", header: "NIC" },
    { key: "case_type", header: "Type" },
    { key: "incident_date", header: "Date", render: (v: string) => v ? v.split("T")[0] : "" },
    { key: "police_station", header: "Police Station" },
    { key: "status", header: "Status", render: (value: string) => <StatusBadge status={(statusMap[value] || "pending") as any} /> },
    { key: "doctor", header: "Doctor" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Search & Retrieval</h1>
        <p className="text-muted-foreground">Advanced search for cases, patients, and reports</p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6"><Filter className="w-5 h-5 text-muted-foreground" /><h3 className="text-card-foreground">Advanced Filters</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm text-muted-foreground mb-2">Case Number</label>
            <input type="text" value={filters.caseNumber} onChange={(e) => setFilters({ ...filters, caseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter case number" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Patient Name</label>
            <input type="text" value={filters.patientName} onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter patient name" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">NIC Number</label>
            <input type="text" value={filters.nic} onChange={(e) => setFilters({ ...filters, nic: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter NIC number" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Police Station</label>
            <input type="text" value={filters.policeStation} onChange={(e) => setFilters({ ...filters, policeStation: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter police station" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Case Type</label>
            <select value={filters.caseType} onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
              <option value="">All Types</option><option>Clinical</option><option>Autopsy</option></select></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Report Status</label>
            <select value={filters.reportStatus} onChange={(e) => setFilters({ ...filters, reportStatus: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background">
              <option value="">All Status</option><option>Pending</option><option>In Progress</option><option>Completed</option><option>Urgent</option></select></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Start Date</label>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">End Date</label>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" /></div>
          <div><label className="block text-sm text-muted-foreground mb-2">Doctor</label>
            <input type="text" value={filters.doctor} onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background" placeholder="Enter doctor name" /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSearch} disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
            <SearchIcon className="w-4 h-4" />{loading ? "Searching..." : "Search"}
          </button>
          <button onClick={handleReset} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">Reset Filters</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {hasSearched ? "Found" : "Showing"} <span className="text-foreground">{searchResults.length}</span> {hasSearched ? "results" : "cases"}
        </p>
        <button onClick={handleExport} disabled={searchResults.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" />Export Results
        </button>
      </div>

      {loading ? <div className="text-center py-8 text-muted-foreground animate-pulse">Searching...</div> : <DataTable columns={columns} data={searchResults} />}
    </div>
  );
}
