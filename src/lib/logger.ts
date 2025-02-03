import path from "path";
import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transport: {
    target: path.join(process.cwd(), "src", "lib", "logger-transport.mjs"),
  },
});
