import { Pokemon, PokemonIndex } from "@app/PokemonIndex.ts";
import { DescriptionStyle } from "@app/DescriptionStyle.ts";

export class AlwaysFoundPokemonIndex implements PokemonIndex {
  lookup(name: string, _style?: DescriptionStyle): Promise<Pokemon> {
    return Promise.resolve({
      name,
      habitat: "habitat",
      isLegendary: false,
      description: "description",
    });
  }
}
