import { Type } from "supposedly";
import { isValid } from "supposedly";

export class PokeApi {
  async get<T>(path: `/api/v2/pokemon-species/${string}`, type: Type<T>) {
    const response = await fetch("https://pokeapi.co" + path);
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
