import { PokemonIndex } from "@app/PokemonIndex.ts";

export class HealthyPokemonIndex implements PokemonIndex {
  lookup(): Promise<undefined> {
    return Promise.resolve(undefined);
  }

  isReady(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
