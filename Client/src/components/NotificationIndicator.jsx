import { useFriendRequests } from "@/queries/friendQueries";

function NotificationIndicator({ size = 5, visibility = true }) {
  const { data: requests = [] } = useFriendRequests();
  const isPendingRequests = requests.length !== 0;

  if (!isPendingRequests) return null;

  return (
    <span className={`h-${size} w-${size} text-sm rounded-full bg-green-500`}>
      {visibility && requests.length}
    </span>
  );
}

export default NotificationIndicator;
