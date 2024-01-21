import { config } from "dotenv";

export default () => {
  if (process.env.ENV_ALREADY_LOADED) return;

  if (process.env.NODE_ENV !== "production") config({ path: ".env.local" });
  else config();

  console.log(`Current node environment is ${process.env.NODE_ENV}`);
};
