import { createServer } from "./server";
import { env } from "./config/env";

const app = createServer();

app.listen(env.PORT, () => {
  console.log(`Saathy backend listening on port ${env.PORT}`);
});
