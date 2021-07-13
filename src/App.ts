import { createServer, Server } from 'http';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { schemas } from './graphql';

export class App {
  express: Application;
  server?: ApolloServer;
  httpServer?: Server;
  constructor() {
    this.express = express();
    this.configExpress();
  }

  private configExpress(): void {
    console.log('todo init express');
  }

  async start(port: number): Promise<void> {
    this.bulidServer();
    await this.server?.start();
    this.middlewares();
    this.httpServer?.listen(port);
  }

  private bulidServer(): void {
    this.buildApolloServer();
    this.buildHttpServer();
  }

  private buildApolloServer(): void {
    this.server = new ApolloServer({
      schema: schemas,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
          : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      ],
    });
  }

  private buildHttpServer(): void {
    this.httpServer = createServer(this.express);
  }

  private middlewares(): void {
    this.server?.applyMiddleware({ app: this.express });
  }
}
