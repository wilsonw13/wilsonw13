export const NODE_ENV_VALUES = ["development", "production", "test"] as const;
export type NODE_ENV = (typeof NODE_ENV_VALUES)[number];