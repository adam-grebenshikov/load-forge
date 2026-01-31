import { cleanEnv, str } from "envalid";

const schema = {
  DATABASE_URL: str({
    default: "postgresql://loadforge:loadforge@localhost:5432/loadforge",
    desc: "PostgreSQL connection URL",
  }),
  REDIS_URL: str({
    default: "redis://localhost:6379",
    desc: "Redis connection URL",
  }),
  KAFKA_BROKERS: str({
    default: "localhost:9092",
    desc: "Kafka broker list (host:port)",
  }),
  CLICKHOUSE_URL: str({
    default: "http://localhost:8123",
    desc: "ClickHouse HTTP URL",
  }),
  NODE_ENV: str({
    default: "development",
    choices: ["development", "test", "production"],
  }),
  GATEWAY_PORT: str({
    default: "3000",
    desc: "Gateway HTTP port",
  }),
  AUTH_PORT: str({
    default: "3001",
    desc: "Auth service HTTP port",
  }),
  CORS_ORIGINS: str({
    default: "*",
    desc: "Comma-separated CORS allowed origins (e.g. https://app.loadforge.io,http://localhost:3000)",
  }),
} as const;

export const config = cleanEnv(process.env, schema);
