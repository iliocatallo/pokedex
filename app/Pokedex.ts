import { Server, ServerRoute } from "@hapi/hapi";
import { HttpResponse } from "@app/HttpResponse.ts";

export class Pokedex {
  private server: Server;

  constructor(port: number) {
    this.server = new Server({ port });
    this.server.route(pokemonRoute());
  }

  get ready() {
    return this.server.start();
  }

  async [Symbol.asyncDispose]() {
    await this.server.stop();
  }
}

function pokemonRoute(): ServerRoute {
  return {
    method: "GET",
    path: "/pokemon/{name}",
    handler: (request, h) => {
      const name = request.params.name;
      if (name === "mewtwo") {
        return HttpResponse.ok({ name }).writeTo(h);
      }
      return HttpResponse.notFound().writeTo(h);
    },
  };
}
