import { APP_STACK, DEFAULT_TOP_N, SERVICE_PACKAGE } from "../config.js";
import { Log } from "../middleware/logging.js";

const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getTimestamp(notification) {
  if (!notification?.timestamp) return 0;

  const parsed = Date.parse(notification.timestamp);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getTopNotifications(notifications, N = DEFAULT_TOP_N) {
  if (!Array.isArray(notifications)) {
    throw new TypeError("notifications must be an array");
  }

  const limit = Number.isInteger(N) && N > 0 ? N : DEFAULT_TOP_N;

  void Log(APP_STACK, "info", SERVICE_PACKAGE, "Sorting started", {
    totalNotifications: notifications.length,
    limit,
  });

const sortedNotifications = [...notifications].sort((a, b) => {
  const typeA = a.type || a.Type;
  const typeB = b.type || b.Type;

  const timeA = a.timestamp || a.Timestamp;
  const timeB = b.timestamp || b.Timestamp;

  const priorityDiff =
    (priority[typeB] || 0) - (priority[typeA] || 0);

  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  return new Date(timeB) - new Date(timeA);
});

  const topNotifications = sortedNotifications.slice(0, limit);

  void Log(APP_STACK, "info", SERVICE_PACKAGE, "Sorting completed", {
    selectedNotifications: topNotifications.length,
    limit,
  });

  return topNotifications;
}