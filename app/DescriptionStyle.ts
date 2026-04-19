import { Pokemon } from "@app/PokemonIndex.ts";

export interface DescriptionStyle {
  applyTo(pokemon: Pokemon): Promise<Pokemon>;
}

// deno-lint-ignore no-namespace
export namespace DescriptionStyle {
  export const verbatim: DescriptionStyle = {
    applyTo(pokemon) {
      return Promise.resolve(pokemon);
    },
  };
}
