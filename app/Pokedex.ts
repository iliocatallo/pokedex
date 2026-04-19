import { Server, ServerRoute } from "@hapi/hapi";
import { HttpResponse } from "@app/HttpResponse.ts";
import { PokemonIndex } from "@app/PokemonIndex.ts";

export class Pokedex {
  private server: Server;

  constructor(port: number, index: PokemonIndex) {
    this.server = new Server({ port });
    this.server.route(pokemonRoute(index));
  }

  get ready() {
    return this.server.start();
  }

  async [Symbol.asyncDispose]() {
    await this.server.stop();
  }
}

function pokemonRoute(index: PokemonIndex): ServerRoute {
  return {
    method: "GET",
    path: "/pokemon/{name}",
    handler: async (request, h) => {
      const name = request.params.name;
      const pokemon = await index.lookup(name);
      const response = pokemon
        ? HttpResponse.ok(pokemon)
        : HttpResponse.notFound();

      return response.writeTo(h);
    },
  };
}
