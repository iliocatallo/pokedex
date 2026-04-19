import { PokemonIndex } from "@app/PokemonIndex.ts";
import { assertEquals } from "@std/assert/equals";
import { PokeApi } from "@app/PokeApi.ts";

Deno.test("Pokemons in the index can be looked up by name", async () => {
  const index = new PokemonIndex(new PokeApi());

  assertEquals(await index.lookup("mewtwo"), { name: "mewtwo" });
});

Deno.test("Looking up a non-existing pokemon returns undefined", async () => {
  const index = new PokemonIndex(new PokeApi());

  assertEquals(await index.lookup("rony"), undefined);
});
