import { arrayOf, boolean, null_, object, oneOf, string } from "supposedly";
import { PokeApi } from "@app/PokeApi.ts";

export class PokemonIndex {
  constructor(private pokeApi: PokeApi) {}

  async lookup(name: string): Promise<Pokemon | undefined> {
    const species = await this.pokeApi.get(
      `/api/v2/pokemon-species/${name}`,
      PokeApiSpecies,
    );
    return species ? { name: species.name } : undefined;
  }
}

const PokeApiSpecies = object({
  name: string,
  is_legendary: boolean,
  habitat: oneOf(object({ name: string }), null_),
  flavor_text_entries: arrayOf(object({
    flavor_text: string,
    language: object({ name: string }),
  })),
});

type Pokemon = { name: string };
