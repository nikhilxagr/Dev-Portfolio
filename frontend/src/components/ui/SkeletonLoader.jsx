import clsx from "clsx";

export const SkeletonBox = ({ className = "", ...props }) => (
  <div
    className={clsx(
      "relative overflow-hidden rounded-xl bg-slate-800/40 dark:bg-slate-900/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      className,
    )}
    {...props}
  />
);

export const SkeletonCard = ({ className = "" }) => (
  <div
    className={clsx(
      "rounded-3xl border border-slate-800/60 bg-slate-900/40 p-6 space-y-4",
      className,
    )}
  >
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-6 w-1/3" />
      <SkeletonBox className="h-6 w-12 rounded-full" />
    </div>
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-5/6" />
    <div className="pt-4 flex gap-2">
      <SkeletonBox className="h-8 w-20 rounded-full" />
      <SkeletonBox className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

export default SkeletonBox;
