import type { NotificationItem } from "../services/api";
import { formatNotificationTime, normalizeNotificationType } from "../utils/sorting";

const toneMap = {
  Placement: {
    accent: "from-emerald-400 via-emerald-500 to-lime-400",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    glow: "shadow-[0_18px_48px_-30px_rgba(16,185,129,0.65)]",
    ring: "border-emerald-100/80",
  },
  Result: {
    accent: "from-sky-400 via-blue-500 to-cyan-400",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    glow: "shadow-[0_18px_48px_-30px_rgba(59,130,246,0.65)]",
    ring: "border-sky-100/80",
  },
  Event: {
    accent: "from-violet-400 via-purple-500 to-fuchsia-400",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    glow: "shadow-[0_18px_48px_-30px_rgba(168,85,247,0.65)]",
    ring: "border-violet-100/80",
  },
} as const;

interface NotificationCardProps {
  notification: NotificationItem;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const type = normalizeNotificationType(notification.type);
  const tone = toneMap[type];

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border bg-white/78 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 ${tone.ring} ${tone.glow}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.accent}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_45%)] opacity-70" />

      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${tone.badge}`}
            >
              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${tone.accent}`} />
              {type}
            </span>
            <p className="max-w-3xl text-base font-semibold leading-7 text-slate-900">
              {notification.message}
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-right shadow-sm">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-slate-400">
              Received
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {formatNotificationTime(notification.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NotificationCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-white/70 bg-white/65 p-5 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.32)] backdrop-blur-xl">
      <div className="h-1 w-28 rounded-full bg-slate-200" />
      <div className="mt-5 h-5 w-32 rounded-full bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-full rounded-full bg-slate-200" />
        <div className="h-4 w-10/12 rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 h-11 w-40 rounded-2xl bg-slate-200" />
    </div>
  );
}

