import { APP_STACK, HTTP_PACKAGE, REQUEST_TIMEOUT_MS } from "../config.js";
import { withLogging } from "../middleware/logging.js";

function buildHeaders(body, headers = {}) {
  if (body === undefined || body === null) {
    return headers;
  }

  return {
    "Content-Type": "application/json",
    ...headers,
  };
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(responseText);
  }

  return responseText;
}

export async function requestJson({
  url,
  method = "GET",
  headers,
  body,
  operation,
  logAccessToken,
}) {
  const runRequest = async () => {
    const response = await fetch(url, {
      method,
      headers: buildHeaders(body, headers),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      const details =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${details}`);
    }

    return payload;
  };

  if (!logAccessToken) {
    return runRequest();
  }

  return withLogging({
    stack: APP_STACK,
    packageName: HTTP_PACKAGE,
    beforeMessage: `Before API call: ${operation}`,
    successMessage: `After API success: ${operation}`,
    errorMessage: `On API error: ${operation}`,
    accessToken: logAccessToken,
    meta: {
      method,
      url,
    },
    run: runRequest,
  });
}
