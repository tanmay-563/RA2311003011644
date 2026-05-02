import { Log } from "../utils/logger";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/75 bg-white/75 p-4 shadow-[0_16px_50px_-34px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-700">
          Showing {startItem}-{endItem} of {totalItems}
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            Log("info", "controller", "Previous page clicked", {
              page: currentPage - 1,
            });
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="rounded-full border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => {
            Log("info", "controller", "Next page clicked", {
              page: currentPage + 1,
            });
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages || totalItems === 0}
          className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_-24px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Next
        </button>
      </div>
    </div>
  );
}

