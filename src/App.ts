import express, { Application } from "express";
import { createServer, Server } from "http";
import { ApolloServer } from "apollo-server-express";

export class App {
  express: Application;
  server: ApolloServer;
  httpServer: Server;
  constructor(server: ApolloServer) {
    this.express = express();
    this.initExpress();
    this.httpServer = createServer(this.express);
    this.server = server;
  }

  async start() {
    await this.server.start();
    this.applyMiddleware();
  }

  initExpress() {}

  applyMiddleware() {
    const app = this.express;
    this.server.applyMiddleware({ app });
  }
}
