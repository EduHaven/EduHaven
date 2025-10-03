import { useFriendRequests } from "@/queries/friendQueries";

function NotificationIndicator({ size = 5, visibility = true }) {
  const { data: requests = [] } = useFriendRequests();
  const count = requests.length;

  if (!count) return null;

  return (
    <div
      className={`h-${size} w-${size} flex justify-center items-center text-xs rounded-full bg-green-500`}
    >
      {visibility && (
        <span className="flex items-center">
          {count > 9 ? `${count}+` : count}
        </span>
      )}
    </div>
  );
}

export default NotificationIndicator;
