import { DescriptionStyle } from "@app/DescriptionStyle.ts";

export interface PokemonIndex {
  lookup(name: string, style?: DescriptionStyle): Promise<Pokemon | undefined>;
  isReady(): Promise<boolean>;
}

export type Pokemon = {
  name: string;
  isLegendary: boolean;
  habitat: string | null;
  description: string;
};
