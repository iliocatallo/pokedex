export class PokeApi {
  async get(path: `/api/v2/pokemon-species/${string}`): Promise<unknown> {
    const response = await fetch("https://pokeapi.co" + path);
    if (!response.ok) {
      await response.body?.cancel();
      return undefined;
    }
    return await response.json();
  }
}
