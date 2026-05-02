import { NOTIFICATIONS_URL } from "../config.js";
import { authenticate } from "./authService.js";
import { requestJson } from "./httpClient.js";
import { Log } from "../middleware/logging.js";

function extractNotifications(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
}

export async function fetchNotifications() {
  const accessToken = await authenticate();

  await Log("backend", "info", "controller", "Fetching notifications", {
    accessToken,
  });

  try {
    const notificationResponse = await requestJson({
      url: NOTIFICATIONS_URL,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      operation: "fetch notifications",
      logAccessToken: accessToken,
    });

    await Log("backend", "info", "controller", "Notifications fetched successfully", {
      accessToken,
    });

    return extractNotifications(notificationResponse);
  } catch (error) {
    await Log("backend", "error", "controller", "Failed to fetch notifications", {
      accessToken,
      error: error.message,
    });
    throw error;
  }
}
