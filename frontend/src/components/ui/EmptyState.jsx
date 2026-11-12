import { memo } from "react";

const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-6 text-center dark:border-white/[0.08] dark:bg-[#11141c]">
      <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-50">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{message}</p>
    </div>
  );
};

const MemoizedEmptyState = memo(EmptyState);
MemoizedEmptyState.displayName = "EmptyState";

export default MemoizedEmptyState;
