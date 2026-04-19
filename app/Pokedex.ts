import { Server } from "@hapi/hapi";

export class Pokedex {
  private server: Server;

  constructor(port: number) {
    this.server = new Server({ port });
    this.server.route({
      method: "GET",
      path: "/pokemon/mewtwo",
      handler: () => ({ name: "mewtwo" }),
    });
  }

  get ready() {
    return this.server.start();
  }

  async [Symbol.asyncDispose]() {
    await this.server.stop();
  }
}
