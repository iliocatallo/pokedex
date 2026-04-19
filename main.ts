import { Pokedex } from "@app/Pokedex.ts";
import { PokemonIndexViaPokeApi } from "@app/PokemonIndexViaPokeApi.ts";
import { PokeApi } from "@app/PokeApi.ts";
import { FunDescriptionStyle } from "@app/FunDescriptionStyle.ts";
import { FunTranslations } from "@app/FunTranslations.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "5000");

await using pokedex = new Pokedex({
  onPort: PORT,
  backedBy: new PokemonIndexViaPokeApi(new PokeApi()),
  styledWith: new FunDescriptionStyle(FunTranslations.withCache()),
});
await pokedex.ready;

const SIGTERM = new Promise<void>((r) => Deno.addSignalListener("SIGTERM", r));
const SIGINT = new Promise<void>((r) => Deno.addSignalListener("SIGINT", r));
await Promise.race([SIGTERM, SIGINT]);
