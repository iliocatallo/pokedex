import { Server, ServerRoute } from "@hapi/hapi";
import { HttpResponse } from "@app/HttpResponse.ts";
import { PokemonIndex } from "@app/PokemonIndex.ts";
import { DescriptionStyle } from "@app/DescriptionStyle.ts";

export class Pokedex {
  private server: Server;

  constructor(
    {
      onPort: port,
      backedBy: index,
      styledWith: style = DescriptionStyle.verbatim,
    }: PokedexOpts,
  ) {
    this.server = new Server({ port });
    this.server.route(pokemonRoute(index));
    this.server.route(pokemonTranslatedRoute(index, style));
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

function pokemonTranslatedRoute(
  index: PokemonIndex,
  style: DescriptionStyle,
): ServerRoute {
  return {
    method: "GET",
    path: "/pokemon/translated/{name}",
    handler: async (request, h) => {
      const name = request.params.name;
      const pokemon = await index.lookup(name, style);
      const response = pokemon
        ? HttpResponse.ok(pokemon)
        : HttpResponse.notFound();

      return response.writeTo(h);
    },
  };
}

type PokedexOpts = {
  onPort: number;
  backedBy: PokemonIndex;
  styledWith?: DescriptionStyle;
};
