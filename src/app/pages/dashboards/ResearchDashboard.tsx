import { useEffect, useState } from "react";
import { StatCard } from "../../components/StatCard";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Database } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../../services/api";

export function ResearchDashboard() {
  const [stats, setStats] = useState<any>({
    totalPatients: 0,
    totalCases: 0,
    totalAutopsies: 0,
    totalClinical: 0,
    monthlyCases: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const monthlyTrends = stats.monthlyCases.map((item: any) => ({
    month: item.month,
    clinical: item.case_type === "Clinical" ? item.count : 0,
    autopsy: item.case_type === "Autopsy" ? item.count : 0,
    total: item.count,
  }));

  const caseDistribution = [
    { name: "Clinical Cases", value: stats.totalClinical, color: "#3b82f6" },
    { name: "Autopsies", value: stats.totalAutopsies, color: "#10b981" },
  ];

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Loading Research Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Research Dashboard</h1>
        <p className="text-muted-foreground">
          Anonymized data, statistics, and research analytics
        </p>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">{error}</div>}

      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h3 className="text-card-foreground mb-1">Data Privacy Notice</h3>
            <p className="text-sm text-muted-foreground">
              All data displayed is anonymized. No patient identifiable information is accessible
              in this view. This dashboard is for research and statistical purposes only.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients Registered"
          value={String(stats.totalPatients)}
          icon={Database}
          change="Demographic database"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Clinical Cases"
          value={String(stats.totalClinical)}
          icon={BarChart3}
          change={`${((stats.totalClinical / (stats.totalCases || 1)) * 100).toFixed(1)}% of total`}
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Autopsy Cases"
          value={String(stats.totalAutopsies)}
          icon={PieChartIcon}
          change={`${((stats.totalAutopsies / (stats.totalCases || 1)) * 100).toFixed(1)}% of total`}
          changeType="increase"
          color="yellow"
        />
        <StatCard
          title="Total Cases Recorded"
          value={String(stats.totalCases)}
          icon={TrendingUp}
          change="Combined system total"
          changeType="increase"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Case Trends Over Time</h3>
          {monthlyTrends.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No monthly trends data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clinical"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Clinical"
                />
                <Line
                  type="monotone"
                  dataKey="autopsy"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Autopsy"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Case Type Distribution</h3>
          {stats.totalCases === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No case type distribution data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={caseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {caseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
