import { Log } from "../utils/logger";
import type { NotificationFilter } from "../utils/sorting";

const filterOptions: NotificationFilter[] = ["All", "Placement", "Result", "Event"];

interface FilterBarProps {
  activeFilter: NotificationFilter;
  counts: Record<NotificationFilter, number>;
  onChange: (filter: NotificationFilter) => void;
}

const filterStyles: Record<NotificationFilter, string> = {
  All: "from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.7)]",
  Placement:
    "from-emerald-500 via-emerald-500 to-lime-400 text-white shadow-[0_18px_40px_-24px_rgba(16,185,129,0.7)]",
  Result:
    "from-sky-500 via-blue-500 to-cyan-400 text-white shadow-[0_18px_40px_-24px_rgba(59,130,246,0.7)]",
  Event:
    "from-violet-500 via-purple-500 to-fuchsia-400 text-white shadow-[0_18px_40px_-24px_rgba(168,85,247,0.7)]",
};

export function FilterBar({ activeFilter, counts, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filterOptions.map((filter) => {
        const isActive = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => {
              Log("info", "controller", "Filter button clicked", { filter });
              onChange(filter);
            }}
            className={`inline-flex items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              isActive
                ? `border-transparent bg-gradient-to-r ${filterStyles[filter]}`
                : "border-white/80 bg-white/70 text-slate-600 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.3)] hover:border-slate-200 hover:bg-white"
            }`}
          >
            <span>{filter}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {counts[filter]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

