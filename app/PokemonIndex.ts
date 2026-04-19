import {
  arrayOf,
  boolean,
  Infer,
  null_ as nil,
  object,
  oneOf,
  string,
} from "supposedly";
import { PokeApi } from "@app/PokeApi.ts";

export type Pokemon = {
  name: string;
  isLegendary: boolean;
  habitat: string | null;
  description: string;
};

export class PokemonIndex {
  constructor(private pokeApi: PokeApi) {}

  async lookup(name: string): Promise<Pokemon | undefined> {
    const species = await this.pokeApi.getSpecies(name, PokeApiSpecies);
    return species ? speciesToPokemon(species) : undefined;
  }
}

function speciesToPokemon(species: PokeApiSpecies) {
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

const PokeApiSpecies = object({
  name: string,
  is_legendary: boolean,
  habitat: oneOf(object({ name: string }), nil),
  flavor_text_entries: arrayOf(object({
    flavor_text: string,
    language: object({ name: string }),
  })),
});

type PokeApiSpecies = Infer<typeof PokeApiSpecies>;
