import { Type } from "supposedly";
import { isValid } from "supposedly";
import { PokeApiLike } from "@app/PokemonIndex.ts";

export class PokeApi implements PokeApiLike {
  async getSpecies<T>(species: string, type: Type<T>) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${species}`,
    );
    if (!response.ok) {
      await response.body?.cancel();
      return undefined;
    }
    const json = await response.json();
    if (!isValid(type, json)) {
      return undefined;
    }
    return json;
  }
}
