import fs from "node:fs/promises";

import { AUTH_BASE_URL, AUTH_STATE_FILE, REQUEST_TIMEOUT_MS } from "../config.js";

const LOGS_URL = `${AUTH_BASE_URL}/logs`;

async function readAccessToken(meta) {
  if (meta?.accessToken) {
    return meta.accessToken;
  }

  try {
    const raw = await fs.readFile(AUTH_STATE_FILE, "utf8");
    const state = JSON.parse(raw);
    return state?.accessToken ?? null;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }

    return null;
  }
}

export async function Log(stack, level, packageName, message, meta = undefined) {
  const entry = {
    stack,
    level,
    package: packageName,
    message,
  };

  try {
    const accessToken = await readAccessToken(meta);
if (!accessToken) {
  console.error("Skipping log: no access token yet");
  return;
}

    const response = await fetch(LOGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${details}`);
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        ...entry,
        loggingError: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

export async function withLogging({
  stack,
  packageName,
  beforeMessage,
  successMessage,
  errorMessage,
  accessToken,
  meta = undefined,
  run,
}) {
  const logMeta = accessToken === undefined ? meta : { ...meta, accessToken };

  await Log(stack, "info", packageName, beforeMessage, logMeta);

  try {
    const result = await run();
    await Log(stack, "info", packageName, successMessage, logMeta);
    return result;
  } catch (error) {
    await Log(stack, "error", packageName, errorMessage, {
      ...logMeta,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
