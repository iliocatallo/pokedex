import { DescriptionStyle } from "@app/DescriptionStyle.ts";
import { Pokemon } from "@app/PokemonIndex.ts";

export class WhateverDescriptionStyle implements DescriptionStyle {
  applyTo(pokemon: Pokemon) {
    return Promise.resolve(pokemon);
  }
}
