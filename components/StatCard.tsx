import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  value: string;
  delta?: string;
}

export default function StatCard({
  icon: Icon,
  iconClass,
  title,
  value,
  delta,
}: Props) {
  return (
    <div className="card">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconClass}`}
      >
        <Icon size={16} className="text-white" />
      </div>

      <p className="text-xs text-luna-100/50 mt-3">{title}</p>
      <h3 className="text-xl font-bold mt-0.5">{value}</h3>

      {delta && (
        <p className="text-[11px] text-emerald-400 mt-1 font-medium">
          {delta}
        </p>
      )}
    </div>
  );
}
