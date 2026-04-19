import { DescriptionStyle } from "@app/DescriptionStyle.ts";
import { Pokemon } from "@app/PokemonIndex.ts";

export class FunDescriptionStyle implements DescriptionStyle {
  constructor(private funTranslations: FunTranslationsLike) {}

  async applyTo(pokemon: Pokemon): Promise<Pokemon> {
    if (pokemon.isLegendary) {
      const description = await this.funTranslations.translate(
        "yoda",
        pokemon.description,
      );
      return { ...pokemon, description: description ?? pokemon.description };
    }
    return pokemon;
  }
}

export interface FunTranslationsLike {
  translate(
    style: "yoda" | "shakespeare",
    text: string,
  ): Promise<string | undefined>;
}
