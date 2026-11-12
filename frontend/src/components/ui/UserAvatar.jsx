import { memo, useState } from "react";

const UserAvatar = ({
  user,
  className = "h-7 w-7 text-xs",
  textClassName = "font-medium",
}) => {
  const [imgError, setImgError] = useState(false);

  if (user?.avatar && !imgError) {
    return (
      <img
        src={user.avatar}
        alt={user.name || "User profile"}
        className={`${className} shrink-0 rounded-full border border-black/[0.10] object-cover dark:border-white/[0.12]`}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        width={32}
        height={32}
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
      />
    );
  }

  const initial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-500/15 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 ${textClassName}`}
    >
      {initial}
    </div>
  );
};

const MemoizedUserAvatar = memo(UserAvatar);
MemoizedUserAvatar.displayName = "UserAvatar";

export default MemoizedUserAvatar;
