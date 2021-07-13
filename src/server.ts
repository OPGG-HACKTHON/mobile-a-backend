import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { schemas } from "./graphql";
import { ApolloServer } from "apollo-server-express";
import { App } from "./App";

const server = new ApolloServer({
  schema: schemas,
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});
const app = new App(server);

(async () => {
  await app.start();

  const PORT = 4000;
  app.httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
