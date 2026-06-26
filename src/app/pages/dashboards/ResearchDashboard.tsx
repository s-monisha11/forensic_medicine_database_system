import { StatCard } from "../../components/StatCard";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Database } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const monthlyTrends = [
  { month: "Jan", clinical: 45, autopsy: 23, total: 68 },
  { month: "Feb", clinical: 52, autopsy: 28, total: 80 },
  { month: "Mar", clinical: 48, autopsy: 31, total: 79 },
  { month: "Apr", clinical: 61, autopsy: 27, total: 88 },
  { month: "May", clinical: 55, autopsy: 35, total: 90 },
];

const caseDistribution = [
  { name: "Assault", value: 145, color: "#3b82f6" },
  { name: "Traffic Accidents", value: 89, color: "#10b981" },
  { name: "Suicide", value: 34, color: "#f59e0b" },
  { name: "Homicide", value: 12, color: "#ef4444" },
  { name: "Natural Causes", value: 67, color: "#8b5cf6" },
  { name: "Others", value: 56, color: "#6366f1" },
];

const demographicData = [
  { ageGroup: "0-18", male: 12, female: 8 },
  { ageGroup: "19-35", male: 89, female: 45 },
  { ageGroup: "36-50", male: 124, female: 67 },
  { ageGroup: "51-65", male: 78, female: 56 },
  { ageGroup: "65+", male: 45, female: 52 },
];

export function ResearchDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground mb-2">Research Dashboard</h1>
        <p className="text-muted-foreground">
          Anonymized data, statistics, and research analytics
        </p>
      </div>

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
          title="Total Cases (6 months)"
          value="403"
          icon={Database}
          change="+8.5% vs last period"
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Clinical Cases"
          value="261"
          icon={BarChart3}
          change="64.8% of total"
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Autopsy Cases"
          value="142"
          icon={PieChartIcon}
          change="35.2% of total"
          changeType="increase"
          color="yellow"
        />
        <StatCard
          title="Monthly Average"
          value="67"
          icon={TrendingUp}
          change="Trending upward"
          changeType="increase"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Case Trends Over Time</h3>
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
              <Line
                type="monotone"
                dataKey="total"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Total"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Case Type Distribution</h3>
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
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <h3 className="text-card-foreground mb-4">Demographic Analysis (Age & Gender)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={demographicData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="ageGroup" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar dataKey="male" fill="#3b82f6" name="Male" />
            <Bar dataKey="female" fill="#ec4899" name="Female" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Key Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Age</span>
              <span className="text-card-foreground">42.3 years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Male:Female Ratio</span>
              <span className="text-card-foreground">1.8:1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Most Common Time</span>
              <span className="text-card-foreground">Weekend evenings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Report Completion Rate</span>
              <span className="text-success">94.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Colombo District</span>
              <span className="text-card-foreground">38%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Kandy District</span>
              <span className="text-card-foreground">22%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Galle District</span>
              <span className="text-card-foreground">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Other Districts</span>
              <span className="text-card-foreground">25%</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="text-card-foreground mb-4">Temporal Patterns</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Peak Month</span>
              <span className="text-card-foreground">May (90 cases)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lowest Month</span>
              <span className="text-card-foreground">January (68 cases)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weekday Average</span>
              <span className="text-card-foreground">12.4 cases/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weekend Average</span>
              <span className="text-card-foreground">16.8 cases/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
