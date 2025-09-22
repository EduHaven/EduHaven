function NotificationIndicator({ size = 5, count, isVisible = true }) {
  return (
    <span className={`size-${size} text-sm rounded-full bg-green-500`}>
      {isVisible && count}
    </span>
  );
}

export default NotificationIndicator;
