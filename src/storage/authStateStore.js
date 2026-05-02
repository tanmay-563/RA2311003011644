import fs from "node:fs/promises";
import path from "node:path";

import { AUTH_STATE_FILE, SERVICE_PACKAGE, APP_STACK } from "../config.js";
import { Log } from "../middleware/logging.js";

const EMPTY_STATE = Object.freeze({
  clientID: null,
  clientSecret: null,
  accessToken: null,
});

async function ensureStateDirectory() {
  await fs.mkdir(path.dirname(AUTH_STATE_FILE), { recursive: true });
}

export async function readAuthState() {
  try {
    const raw = await fs.readFile(AUTH_STATE_FILE, "utf8");
    return {
      ...EMPTY_STATE,
      ...JSON.parse(raw),
    };
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return { ...EMPTY_STATE };
    }

    throw error;
  }
}

export async function writeAuthState(patch) {
  const currentState = await readAuthState();

  if (currentState.accessToken || patch.accessToken) {
    void Log(APP_STACK, "info", SERVICE_PACKAGE, "Persisting auth state", {
      keys: Object.keys(patch),
    });
  }

  const nextState = {
    ...currentState,
    ...patch,
  };

  await ensureStateDirectory();
  await fs.writeFile(AUTH_STATE_FILE, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");

  if (nextState.accessToken) {
    void Log(APP_STACK, "info", SERVICE_PACKAGE, "Auth state persisted", {
      keys: Object.keys(patch),
    });
  }

  return nextState;
}
