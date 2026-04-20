import { PokeApiLike } from "@app/PokemonIndexViaPokeApi.ts";

export class HealthyPokeApi implements PokeApiLike {
  getSpecies(): Promise<undefined> {
    return Promise.resolve(undefined);
  }
  isReady(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
