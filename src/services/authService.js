import {
  APP_STACK,
  AUTH_URL,
  REGISTER_URL,
  SERVICE_PACKAGE,
  getRegistrationConfig,
} from "../config.js";
import { Log } from "../middleware/logging.js";
import { requestJson } from "./httpClient.js";
import { readAuthState, writeAuthState } from "../storage/authStateStore.js";

function requireRegistrationFields(config) {
  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function getClientCredentials(payload) {
  const clientID = payload?.clientID ?? payload?.clientId ?? null;
  const clientSecret = payload?.clientSecret ?? null;

  if (!clientID || !clientSecret) {
    throw new Error("Registration response did not include client credentials");
  }

  return { clientID, clientSecret };
}

function getAccessToken(payload) {
  const accessToken = payload?.access_token ?? payload?.accessToken ?? null;

  if (!accessToken) {
    throw new Error("Authentication response did not include access token");
  }

  return accessToken;
}

export async function registerClient() {
  const config = getRegistrationConfig();
  requireRegistrationFields(config);

  const authState = await readAuthState();

  if (authState.clientID && authState.clientSecret) {
    if (authState.accessToken) {
      void Log(APP_STACK, "info", SERVICE_PACKAGE, "Using saved client credentials");
    }

    return {
      clientID: authState.clientID,
      clientSecret: authState.clientSecret,
    };
  }

  const registrationResponse = await requestJson({
    url: REGISTER_URL,
    method: "POST",
    body: config,
    operation: "register client",
  });

  const credentials = getClientCredentials(registrationResponse);
  await writeAuthState(credentials);

  return credentials;
}

export async function authenticate() {
  const config = getRegistrationConfig();
  
  requireRegistrationFields(config);

  const { clientID, clientSecret } = await registerClient();

  const authResponse = await requestJson({
    url: AUTH_URL,
    method: "POST",
    body: {
      email: config.email,
      name: config.name,
      rollNo: config.rollNo,
      accessCode: config.accessCode,
      clientID,
      clientSecret,
    },
    operation: "authenticate client",
  });

  const accessToken = getAccessToken(authResponse);
  await writeAuthState({ accessToken });

  return accessToken;
}
