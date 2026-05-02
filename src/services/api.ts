import { Log } from "../utils/logger";

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const NOTIFICATIONS_URL = "http://20.207.122.201/evaluation-service/notifications";

function normalizeNotificationType(type: unknown) {
  if (typeof type !== "string") {
    return "Event";
  }

  const normalized = type.trim().toLowerCase();

  if (normalized === "placement") {
    return "Placement";
  }

  if (normalized === "result") {
    return "Result";
  }

  return "Event";
}

function normalizeNotificationMessage(notification: Record<string, unknown>) {
  if (typeof notification.message === "string" && notification.message.trim()) {
    return notification.message.trim();
  }

  if (typeof notification.content === "string" && notification.content.trim()) {
    return notification.content.trim();
  }

  if (typeof notification.title === "string" && notification.title.trim()) {
    return notification.title.trim();
  }

  return "Notification update";
}

function normalizeNotificationTimestamp(timestamp: unknown) {
  if (typeof timestamp === "string" && !Number.isNaN(Date.parse(timestamp))) {
    return timestamp;
  }

  return new Date().toISOString();
}

function extractNotifications(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { notifications?: unknown[] }).notifications)
  ) {
    return (payload as { notifications: unknown[] }).notifications;
  }

  return [];
}

function normalizeNotification(
  notification: unknown,
  index: number,
): NotificationItem {
  const record =
    notification && typeof notification === "object"
      ? (notification as Record<string, unknown>)
      : {};

  const type = normalizeNotificationType(record.type);
  const timestamp = normalizeNotificationTimestamp(record.timestamp);
  const message = normalizeNotificationMessage(record);
  const idSource =
    typeof record.id === "string" || typeof record.id === "number"
      ? String(record.id)
      : `${type}-${timestamp}-${index}`;

  return {
    id: idSource,
    type,
    message,
    timestamp,
  };
}

export async function fetchNotifications(
  signal?: AbortSignal,
): Promise<NotificationItem[]> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;

  if (!accessToken) {
    const error = new Error("Missing VITE_ACCESS_TOKEN environment variable.");
    Log("error", "utils", "Missing access token for notification request");
    throw error;
  }

  Log("info", "utils", "Starting notification fetch", {
    url: NOTIFICATIONS_URL,
  });

  try {
    const response = await fetch(NOTIFICATIONS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Notification request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const notifications = extractNotifications(payload).map(normalizeNotification);

    Log("info", "utils", "Notification fetch completed", {
      count: notifications.length,
    });

    return notifications;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    Log("error", "utils", "Notification fetch failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

