import { PokemonIndex } from "@app/PokemonIndex.ts";

export class EmptyPokemonIndex implements PokemonIndex {
  lookup(): Promise<undefined> {
    return Promise.resolve(undefined);
  }
}
