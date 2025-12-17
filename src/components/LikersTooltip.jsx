import React from "react";
import userAvatarImg from "../../public/user.jpeg";

const LikersTooltip= ({ likers, show }) => {
  if (likers.length === 0) return null;

  const maxDisplay = 5;
  const extraCount = likers.length - maxDisplay;

  return (
    <div
      className={`
        absolute left-0 bg-white shadow-lg border rounded-lg p-3 w-64 z-50 pointer-events-none
        transition-all duration-200 ease-out transform
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        md:-top-16 md:left-0
        sm:top-full sm:mt-2 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0
      `}
    >
      {/* Arrow */}
      <div
        className="
        absolute -bottom-2 left-5 w-0 h-0 border-l-8 border-r-8 border-b-8
        border-l-transparent border-r-transparent border-b-white pointer-events-none
        sm:top-0 sm:-bottom-2 sm:border-b-transparent sm:border-t-8 sm:border-t-white
      "
      ></div>

      <div className="font-semibold mb-2 text-sm">Liked by</div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {likers.slice(0, maxDisplay).map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <img
              src={user.avatarUrl || userAvatarImg}
              alt={user.displayName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-sm">
              <span className="font-medium">{user.displayName}</span>{" "}
              {user.user.pseudoname && (
                <span className="text-gray-400 text-xs">
                  ({user.user.pseudoname})
                </span>
              )}
              {user.user.username && (
                <span className="text-gray-400 text-xs ml-1">
                  @{user.user.username}
                </span>
              )}
            </div>
          </div>
        ))}

        {extraCount > 0 && (
          <div className="text-gray-500 text-sm mt-1">+{extraCount} more</div>
        )}
      </div>
    </div>
  );
};

export default LikersTooltip;
