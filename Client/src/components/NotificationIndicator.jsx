import { useFriendRequests } from "@/queries/friendQueries";

function NotificationIndicator({ size = 5, visibility = true }) {
  const { data: requests = [] } = useFriendRequests();
  const isPendingRequests = requests.length !== 0;

  if (!isPendingRequests) return null;

  return (
    <div className={`h-${size} w-${size} text-sm rounded-full bg-green-500`}>
      {visibility && requests.length}
    </div>
  );
}

export default NotificationIndicator;
