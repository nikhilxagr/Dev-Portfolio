import { memo, useState } from "react";

const UserAvatar = ({ user, className = "h-7 w-7 text-xs", textClassName = "font-black" }) => {
  const [imgError, setImgError] = useState(false);

  if (user?.avatar && !imgError) {
    return (
      <img
        src={user.avatar}
        alt={user.name || "User profile"}
        className={`${className} rounded-full object-cover shrink-0 border border-emerald-500/30`}
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
      className={`${className} flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-lime-400 text-slate-950 ${textClassName} shrink-0 shadow-sm border border-emerald-400/40`}
    >
      {initial}
    </div>
  );
};

const MemoizedUserAvatar = memo(UserAvatar);
MemoizedUserAvatar.displayName = "UserAvatar";

export default MemoizedUserAvatar;
