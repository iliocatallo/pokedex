import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";
import { HttpResponse } from "@app/HttpResponse.ts";
import { Http } from "./Http.ts";
import { EmptyPokemonIndex } from "./EmptyPokemonIndex.ts";
import { AlwaysFoundPokemonIndex } from "./AlwaysFoundPokemonIndex.ts";

const PORT = 1111;

Deno.test("Pokedex responds with Pokemon", async () => {
  const index = new AlwaysFoundPokemonIndex();
  await using pokedex = new Pokedex({ onPort: PORT, backedBy: index });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/mewtwo"),
    HttpResponse.ok(await index.lookup("mewtwo")),
  );
});

Deno.test("Pokedex responds with not found when the Pokemon does not exist", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new EmptyPokemonIndex(),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/rony"),
    HttpResponse.notFound(),
  );
});
