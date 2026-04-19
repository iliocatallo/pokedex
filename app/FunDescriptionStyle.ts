import { DescriptionStyle } from "@app/DescriptionStyle.ts";
import { Pokemon } from "@app/PokemonIndex.ts";

export class FunDescriptionStyle implements DescriptionStyle {
  constructor(private funTranslations: FunTranslationsLike) {}

  async applyTo(pokemon: Pokemon): Promise<Pokemon> {
    const style = (pokemon.isLegendary || pokemon.habitat === "cave")
      ? "yoda"
      : "shakespeare";
    const description = await this.funTranslations.translate(
      style,
      pokemon.description,
    );
    return { ...pokemon, description: description ?? pokemon.description };
  }
}

export interface FunTranslationsLike {
  translate(
    style: "yoda" | "shakespeare",
    text: string,
  ): Promise<string | undefined>;
}
