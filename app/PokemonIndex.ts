export interface PokemonIndex {
  lookup(name: string): Promise<Pokemon | undefined>;
}

export type Pokemon = {
  name: string;
  isLegendary: boolean;
  habitat: string | null;
  description: string;
};
