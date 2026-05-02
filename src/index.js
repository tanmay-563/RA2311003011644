import { DEFAULT_TOP_N } from "./config.js";
import { Log } from "./middleware/logging.js";
import { fetchNotifications } from "./services/notificationService.js";
import { getTopNotifications } from "./utils/getTopNotifications.js";

async function main() {
  const notifications = await fetchNotifications();
  const topN = Number.parseInt(process.env.TOP_N ?? `${DEFAULT_TOP_N}`, 10);
  const topNotifications = getTopNotifications(notifications, topN);

  process.stdout.write(`${JSON.stringify(topNotifications, null, 2)}\n`);
}

main().catch((error) => {
  console.error("Application failure:", error);
  process.exitCode = 1;
});
