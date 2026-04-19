import { retry } from "@std/async";
import { isValid, Type } from "supposedly";
import { PokeApiLike } from "@app/PokemonIndexViaPokeApi.ts";

export class PokeApi implements PokeApiLike {
  async getSpecies<T>(species: string, type: Type<T>) {
    try {
      return await retry(async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${species}`,
        );
        if (response.status === 404) return undefined;
        if (!response.ok) {
          await response.body?.cancel();
          throw new TransientHttpError(response.status);
        }
        const json = await response.json();
        if (!isValid(type, json)) {
          return undefined;
        }
        return json;
      }, {
        isRetriable: (err) =>
          err instanceof TransientHttpError && err.status >= 500,
      });
    } catch {
      return undefined;
    }
  }
}

class TransientHttpError extends Error {
  public status: number;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}
