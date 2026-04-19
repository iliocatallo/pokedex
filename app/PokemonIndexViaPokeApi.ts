import { Pokemon, PokemonIndex } from "@app/PokemonIndex.ts";
import {
  arrayOf,
  boolean,
  Infer,
  null_ as nil,
  object,
  oneOf,
  string,
  Type,
} from "supposedly";

export class PokemonIndexViaPokeApi implements PokemonIndex {
  constructor(private pokeApi: PokeApiLike) {}

  async lookup(name: string): Promise<Pokemon | undefined> {
    const species = await this.pokeApi.getSpecies(name, PokeApiSpecies);
    return species ? speciesToPokemon(species) : undefined;
  }
}

function speciesToPokemon(species: Infer<typeof PokeApiSpecies>) {
  const entry = species.flavor_text_entries.find(({ language }) =>
    language.name === "en"
  );
  const description = entry?.flavor_text.replace(/[\n\f\r]+/g, " ");
  if (!description) return undefined;

  return {
    name: species.name,
    isLegendary: species.is_legendary,
    habitat: species.habitat?.name ?? null,
    description,
  };
}

export interface PokeApiLike {
  getSpecies<T>(species: string, type: Type<T>): Promise<T | undefined>;
}

const PokeApiSpecies = object({
  name: string,
  is_legendary: boolean,
  habitat: oneOf(object({ name: string }), nil),
  flavor_text_entries: arrayOf(object({
    flavor_text: string,
    language: object({ name: string }),
  })),
});
