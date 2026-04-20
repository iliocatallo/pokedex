import { isValid } from "supposedly";
import { Type } from "supposedly";
import { PokeApiLike } from "@app/PokemonIndexViaPokeApi.ts";

export class StubPokeApi implements PokeApiLike {
  constructor(private samples: Record<string, unknown>) {}

  getSpecies<T>(species: string, type: Type<T>) {
    const sample = this.samples[species];
    return isValid(type, sample)
      ? Promise.resolve(sample)
      : Promise.resolve(undefined);
  }

  isReady(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
