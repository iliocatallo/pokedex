import { ResponseEventHandler, Server, ServerRoute } from "@hapi/hapi";
import { HttpResponse } from "@app/HttpResponse.ts";
import { PokemonIndex } from "@app/PokemonIndex.ts";
import { DescriptionStyle } from "@app/DescriptionStyle.ts";
import { Support } from "@app/Support.ts";

export class Pokedex {
  private server: Server;

  constructor(
    {
      onPort: port,
      backedBy: index,
      styledWith: style = DescriptionStyle.verbatim,
      monitoredBy: support = Support.absent,
    }: PokedexOpts,
  ) {
    this.server = new Server({ port });
    this.server.route(healthRoute(index));
    this.server.route(pokemonRoute(index));
    this.server.route(pokemonTranslatedRoute(index, style));
    this.server.events.on("response", logResponse(support));
  }

  get ready() {
    return this.server.start();
  }

  async [Symbol.asyncDispose]() {
    await this.server.stop();
  }
}

function healthRoute(index: PokemonIndex): ServerRoute {
  return {
    method: "GET",
    path: "/health",
    handler: async (_, h) => {
      const response = await index.isReady()
        ? HttpResponse.ok({ status: "ok" })
        : HttpResponse.serviceUnavailable({ status: "unavailable" });
      return response.writeTo(h);
    },
  };
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

function logResponse(support: Support): ResponseEventHandler {
  return (request) => {
    const response = request.response as { statusCode?: number };
    support.onResponse({
      id: request.info.id,
      method: request.method.toUpperCase(),
      path: request.path,
      statusCode: response.statusCode,
      elapsedMs: Date.now() - request.info.received,
    });
  };
}

type PokedexOpts = {
  onPort: number;
  backedBy: PokemonIndex;
  styledWith?: DescriptionStyle;
  monitoredBy?: Support;
};
