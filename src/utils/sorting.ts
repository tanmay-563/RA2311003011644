import type { NotificationItem } from "../services/api";

export type NotificationFilter = "All" | "Placement" | "Result" | "Event";

const PRIORITY: Record<Exclude<NotificationFilter, "All">, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function normalizeNotificationType(
  type: string,
): Exclude<NotificationFilter, "All"> {
  const normalized = type.trim().toLowerCase();

  if (normalized === "placement") {
    return "Placement";
  }

  if (normalized === "result") {
    return "Result";
  }

  return "Event";
}

export function sortNotifications(notifications: NotificationItem[]) {
  return [...notifications].sort((left, right) => {
    const typeDelta =
      PRIORITY[normalizeNotificationType(right.type)] -
      PRIORITY[normalizeNotificationType(left.type)];

    if (typeDelta !== 0) {
      return typeDelta;
    }

    return Date.parse(right.timestamp) - Date.parse(left.timestamp);
  });
}

export function filterNotifications(
  notifications: NotificationItem[],
  activeFilter: NotificationFilter,
) {
  if (activeFilter === "All") {
    return notifications;
  }

  return notifications.filter(
    (notification) => normalizeNotificationType(notification.type) === activeFilter,
  );
}

export function getNotificationCounts(notifications: NotificationItem[]) {
  return notifications.reduce<Record<NotificationFilter, number>>(
    (counts, notification) => {
      counts.All += 1;
      counts[normalizeNotificationType(notification.type)] += 1;
      return counts;
    },
    {
      All: 0,
      Placement: 0,
      Result: 0,
      Event: 0,
    },
  );
}

export function formatNotificationTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

