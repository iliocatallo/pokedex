import { retry } from "@std/async";
import { isValid, Type } from "supposedly";
import { PokeApiLike } from "@app/PokemonIndexViaPokeApi.ts";

const REQUEST_TIMEOUT_MS = 3_000;

export class PokeApi implements PokeApiLike {
  async getSpecies<T>(species: string, type: Type<T>) {
    try {
      return await retry(async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${species}`,
          { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
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
      }, { isRetriable: isTransientError });
    } catch {
      return undefined;
    }
  }

  async isReady(): Promise<boolean> {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/", {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      await response.body?.cancel();
      return response.ok;
    } catch {
      return false;
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

function isTransientError(err: unknown): boolean {
  return (err instanceof TransientHttpError && err.status >= 500) ||
    (err instanceof DOMException && err.name === "TimeoutError");
}
