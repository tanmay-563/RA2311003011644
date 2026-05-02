import { startTransition, useEffect, useState } from "react";

import { FilterBar } from "../components/FilterBar";
import {
  NotificationCard,
  NotificationCardSkeleton,
} from "../components/NotificationCard";
import { Pagination } from "../components/Pagination";
import { fetchNotifications, type NotificationItem } from "../services/api";
import { Log } from "../utils/logger";
import {
  filterNotifications,
  getNotificationCounts,
  normalizeNotificationType,
  sortNotifications,
  type NotificationFilter,
} from "../utils/sorting";

const PAGE_SIZE = 6;

const statStyles = {
  All: "from-slate-950 via-slate-800 to-slate-700 text-white",
  Placement: "from-emerald-500 via-emerald-500 to-lime-400 text-white",
  Result: "from-sky-500 via-blue-500 to-cyan-400 text-white",
  Event: "from-violet-500 via-purple-500 to-fuchsia-400 text-white",
} as const;

export function Dashboard() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotifications() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchNotifications(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        startTransition(() => {
          setNotifications(sortNotifications(response));
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while loading notifications.";

        setErrorMessage(message);
        Log("error", "controller", "Dashboard notification load failed", {
          error: message,
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadNotifications();

    return () => controller.abort();
  }, [refreshKey]);

  const counts = getNotificationCounts(notifications);
  const filteredNotifications = filterNotifications(notifications, activeFilter);
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginatedNotifications = filteredNotifications.slice(
    pageStart,
    pageStart + PAGE_SIZE,
  );

  function handleFilterChange(filter: NotificationFilter) {
    startTransition(() => {
      setActiveFilter(filter);
      setCurrentPage(1);
    });
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    startTransition(() => {
      setCurrentPage(page);
    });
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/55 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.88)_38%,rgba(59,130,246,0.82)_68%,rgba(168,85,247,0.82))] px-6 py-8 text-white shadow-[0_28px_80px_-34px_rgba(15,23,42,0.55)] sm:px-8 lg:px-10">
          <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-white/12 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/85 backdrop-blur-md">
                Premium Notifications Dashboard
              </span>
              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[3.2rem]">
                Prioritized updates with a cleaner signal and faster triage.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Monitor placement, result, and event alerts in a focused workspace
                built for quick scanning, crisp hierarchy, and effortless paging.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-200">
                  Total Alerts
                </p>
                <p className="mt-3 text-3xl font-bold">{counts.All}</p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-200">
                  Active Filter
                </p>
                <p className="mt-3 text-3xl font-bold">{activeFilter}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              ["All", "Every notification in the stream."],
              ["Placement", "High-priority placement updates."],
              ["Result", "Result releases and announcements."],
              ["Event", "Events, drives, and reminders."],
            ] as const
          ).map(([label, caption]) => (
            <article
              key={label}
              className={`rounded-[28px] border border-white/70 bg-gradient-to-br p-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl ${statStyles[label]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                {label}
              </p>
              <p className="mt-5 text-3xl font-bold">{counts[label]}</p>
              <p className="mt-2 text-sm text-white/75">{caption}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[34px] border border-white/70 bg-white/66 p-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.28)] backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Notification Feed
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Sorted by priority and freshest arrival
                </h2>
              </div>
              <FilterBar
                activeFilter={activeFilter}
                counts={counts}
                onChange={handleFilterChange}
              />
            </div>

            {isLoading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <NotificationCardSkeleton key={`notification-skeleton-${index}`} />
                ))}
              </div>
            ) : null}

            {!isLoading && errorMessage ? (
              <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 shadow-[0_18px_50px_-34px_rgba(244,63,94,0.35)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Error
                </p>
                <h3 className="mt-3 text-xl font-bold text-rose-900">
                  Notifications could not be loaded
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-rose-700">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    Log("info", "controller", "Retry load clicked");
                    startTransition(() => {
                      setRefreshKey((value) => value + 1);
                    });
                  }}
                  className="mt-5 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {!isLoading && !errorMessage && filteredNotifications.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 p-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Empty State
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-900">
                  No notifications for {activeFilter}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try another filter to explore the rest of the feed.
                </p>
              </div>
            ) : null}

            {!isLoading && !errorMessage && filteredNotifications.length > 0 ? (
              <>
                <div className="grid gap-4 lg:grid-cols-2">
                  {paginatedNotifications.map((notification) => (
                    <NotificationCard
                      key={`${normalizeNotificationType(notification.type)}-${notification.id}`}
                      notification={notification}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalItems={filteredNotifications.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
