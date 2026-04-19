import { PokeApi } from "@app/PokeApi.ts";

export class PokemonIndex {
  constructor(private pokeApi: PokeApi) {}

  async lookup(name: string): Promise<Pokemon | undefined> {
    const species = await this.pokeApi.get(`/api/v2/pokemon-species/${name}`);
    if (!hasRequiredFields(species)) {
      return undefined;
    }

    return { name: species.name };
  }
}

// deno-lint-ignore no-explicit-any
function hasRequiredFields(species: any): species is { name: string } {
  return species && "name" in species && typeof species.name === "string";
}

type Pokemon = { name: string };
