type LogLevel = "info" | "error";
type LogScope = "controller" | "utils" | "middleware";

interface LogMeta {
  [key: string]: unknown;
}

export function Log(
  level: LogLevel,
  scope: LogScope,
  message: string,
  meta?: LogMeta,
) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    message,
    meta,
  };

  const writer = level === "error" ? console.error : console.log;
  writer(payload);
}

