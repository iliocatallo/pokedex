import { Pokemon, PokemonIndex } from "@app/PokemonIndex.ts";

export class AlwaysFoundPokemonIndex implements PokemonIndex {
  lookup(name: string): Promise<Pokemon> {
    return Promise.resolve({
      name,
      habitat: "habitat",
      isLegendary: false,
      description: "description",
    });
  }
}
