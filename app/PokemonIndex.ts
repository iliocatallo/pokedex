export class PokemonIndex {
  lookup(name: string): Promise<Pokemon | undefined> {
    return Promise.resolve(name === "mewtwo" ? { name: "mewtwo" } : undefined);
  }
}

type Pokemon = { name: string };
