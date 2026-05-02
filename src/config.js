import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

export const APP_STACK = "backend";
export const SERVICE_PACKAGE = "middleware";
export const HTTP_PACKAGE = "utils";
export const AUTH_BASE_URL = "http://20.207.122.201/evaluation-service";
export const REGISTER_URL = `${AUTH_BASE_URL}/register`;
export const AUTH_URL = `${AUTH_BASE_URL}/auth`;
export const NOTIFICATIONS_URL = `${AUTH_BASE_URL}/notifications`;
export const AUTH_STATE_FILE = path.join(rootDir, ".runtime", "auth-state.json");
export const DEFAULT_TOP_N = 10;
export const REQUEST_TIMEOUT_MS = 15000;

export function getRegistrationConfig() {
  return {
    email: process.env.REG_EMAIL?.trim(),
    name: process.env.REG_NAME?.trim(),
    mobileNo: process.env.REG_MOBILE_NO?.trim(),
    githubUsername: process.env.REG_GITHUB_USERNAME?.trim(),
    rollNo: process.env.REG_ROLL_NO?.trim(),
    accessCode: process.env.ACCESS_CODE?.trim() || "QkbpxH",
  };
}
