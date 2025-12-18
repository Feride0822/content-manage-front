import userAvatarImg from "../../public/user.jpeg";

const ViewersTooltip = ({ viewers, show }) => {
  if (!show || viewers.length === 0) return null;

  return (
    <div className="absolute -top-16 left-0 bg-white shadow-lg border rounded-lg p-3 w-64 z-50 pointer-events-none">
      <div className="absolute -bottom-2 left-5 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />

      <div className="font-semibold mb-2 text-sm">Viewed by</div>

      <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
        {viewers.slice(0, 5).map((v) => (
          <div key={v.id} className="flex items-center gap-2">
            <img
              src={v.user.avatarUrl || userAvatarImg}
              className="w-6 h-6 rounded-full"
            />
            <div className="text-sm">
              <span className="font-medium">{v.user.displayName}</span>
              {v.user.username && (
                <span className="text-gray-400 text-xs ml-1">
                  @{v.user.username}
                </span>
              )}
            </div>
          </div>
        ))}
        {viewers.length > 5 && (
          <div className="text-gray-500 text-sm">
            +{viewers.length - 5} more
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewersTooltip;
