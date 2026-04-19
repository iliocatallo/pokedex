import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";
import { PokemonIndexViaPokeApi } from "@app/PokemonIndexViaPokeApi.ts";
import { PokeApi } from "@app/PokeApi.ts";
import { HttpResponse } from "@app/HttpResponse.ts";
import { Http } from "./Http.ts";

const PORT = 1111;

Deno.test("Pokedex responds with Pokemon", async () => {
  const index = new PokemonIndexViaPokeApi(new PokeApi());
  await using pokedex = new Pokedex(PORT, index);
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/mewtwo"),
    HttpResponse.ok(await index.lookup("mewtwo")),
  );
});

Deno.test("Pokedex responds with not found when the Pokemon does not exist", async () => {
  const index = new PokemonIndexViaPokeApi(new PokeApi());
  await using pokedex = new Pokedex(PORT, index);

  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/rony"),
    HttpResponse.notFound(),
  );
});
