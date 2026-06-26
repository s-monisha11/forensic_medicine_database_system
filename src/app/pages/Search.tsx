import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Search as SearchIcon, Filter, Download } from "lucide-react";

const allCases = [
  {
    caseId: "CLN-2024-156",
    patientName: "W.M. Silva",
    nic: "923456789V",
    type: "Clinical",
    date: "2024-05-27",
    policeStation: "Colombo Central",
    status: "pending",
    doctor: "Dr. Perera",
  },
  {
    caseId: "PM-2024-089",
    patientName: "K.D. Fernando",
    nic: "885678901V",
    type: "Autopsy",
    date: "2024-05-26",
    policeStation: "Kandy",
    status: "completed",
    doctor: "Dr. Jayawardena",
  },
  {
    caseId: "CLN-2024-155",
    patientName: "S.A. Wijesuriya",
    nic: "901234567V",
    type: "Clinical",
    date: "2024-05-26",
    policeStation: "Galle",
    status: "in_progress",
    doctor: "Dr. De Silva",
  },
  {
    caseId: "PM-2024-088",
    patientName: "R.P. Wickramasinghe",
    nic: "875432109V",
    type: "Autopsy",
    date: "2024-05-25",
    policeStation: "Colombo Central",
    status: "urgent",
    doctor: "Dr. Perera",
  },
  {
    caseId: "CLN-2024-154",
    patientName: "R.K. Mendis",
    nic: "891234567V",
    type: "Clinical",
    date: "2024-05-25",
    policeStation: "Galle",
    status: "completed",
    doctor: "Dr. De Silva",
  },
];

export function Search() {
  const [searchResults, setSearchResults] = useState(allCases);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    caseNumber: "",
    patientName: "",
    nic: "",
    policeStation: "",
    caseType: "",
    reportStatus: "",
    startDate: "",
    endDate: "",
    doctor: "",
  });

  const handleSearch = () => {
    let results = [...allCases];

    if (filters.caseNumber) {
      results = results.filter((c) =>
        c.caseId.toLowerCase().includes(filters.caseNumber.toLowerCase())
      );
    }

    if (filters.patientName) {
      results = results.filter((c) =>
        c.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
      );
    }

    if (filters.nic) {
      results = results.filter((c) => c.nic.toLowerCase().includes(filters.nic.toLowerCase()));
    }

    if (filters.policeStation) {
      results = results.filter((c) =>
        c.policeStation.toLowerCase().includes(filters.policeStation.toLowerCase())
      );
    }

    if (filters.caseType) {
      results = results.filter((c) => c.type === filters.caseType);
    }

    if (filters.reportStatus) {
      results = results.filter(
        (c) => c.status.toLowerCase() === filters.reportStatus.toLowerCase()
      );
    }

    if (filters.doctor) {
      results = results.filter((c) => c.doctor === filters.doctor);
    }

    if (filters.startDate) {
      results = results.filter((c) => c.date >= filters.startDate);
    }

    if (filters.endDate) {
      results = results.filter((c) => c.date <= filters.endDate);
    }

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleReset = () => {
    setFilters({
      caseNumber: "",
      patientName: "",
      nic: "",
      policeStation: "",
      caseType: "",
      reportStatus: "",
      startDate: "",
      endDate: "",
      doctor: "",
    });
    setSearchResults(allCases);
    setHasSearched(false);
  };

  const columns = [
    { key: "caseId", header: "Case ID" },
    { key: "patientName", header: "Patient Name" },
    { key: "nic", header: "NIC" },
    { key: "type", header: "Type" },
    { key: "date", header: "Date" },
    { key: "policeStation", header: "Police Station" },
    {
      key: "status",
      header: "Status",
      render: (value: string) => <StatusBadge status={value as any} />,
    },
    { key: "doctor", header: "Doctor" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Search & Retrieval</h1>
        <p className="text-muted-foreground">
          Advanced search for cases, patients, and reports
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-card-foreground">Advanced Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Case Number</label>
            <input
              type="text"
              value={filters.caseNumber}
              onChange={(e) => setFilters({ ...filters, caseNumber: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Enter case number"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Patient Name</label>
            <input
              type="text"
              value={filters.patientName}
              onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">NIC Number</label>
            <input
              type="text"
              value={filters.nic}
              onChange={(e) => setFilters({ ...filters, nic: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Enter NIC number"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Police Station</label>
            <input
              type="text"
              value={filters.policeStation}
              onChange={(e) => setFilters({ ...filters, policeStation: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
              placeholder="Enter police station"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Case Type</label>
            <select
              value={filters.caseType}
              onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            >
              <option value="">All Types</option>
              <option>Clinical</option>
              <option>Autopsy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Report Status</label>
            <select
              value={filters.reportStatus}
              onChange={(e) => setFilters({ ...filters, reportStatus: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            >
              <option value="">All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Doctor</label>
            <select
              value={filters.doctor}
              onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            >
              <option value="">All Doctors</option>
              <option>Dr. Perera</option>
              <option>Dr. Jayawardena</option>
              <option>Dr. De Silva</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {hasSearched ? "Found" : "Showing"}{" "}
          <span className="text-foreground">{searchResults.length}</span>{" "}
          {hasSearched ? "results" : "cases"}
        </p>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      <DataTable columns={columns} data={searchResults} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-{Math.min(10, searchResults.length)} of {searchResults.length} results
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-border rounded hover:bg-accent transition-colors">
            Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border border-border rounded transition-colors ${
                page === 1
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 border border-border rounded hover:bg-accent transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
