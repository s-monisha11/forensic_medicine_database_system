import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
  color?: "blue" | "green" | "red" | "yellow";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    red: "bg-destructive/10 text-destructive",
    yellow: "bg-warning/10 text-warning",
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl text-card-foreground mb-2">{value}</h3>
          {change && (
            <p
              className={`text-sm ${
                changeType === "increase" ? "text-success" : "text-destructive"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
