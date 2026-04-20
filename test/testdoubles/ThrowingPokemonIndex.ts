import { Pokemon, PokemonIndex } from "@app/PokemonIndex.ts";

export class ThrowingPokemonIndex implements PokemonIndex {
  private error: Error;

  constructor({ throws: error }: { throws: Error }) {
    this.error = error;
  }

  lookup(): Promise<Pokemon> {
    throw this.error;
  }
  isReady(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
