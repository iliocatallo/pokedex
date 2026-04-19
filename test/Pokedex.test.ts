import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";
import { HttpResponse } from "@app/HttpResponse.ts";
import { Http } from "./Http.ts";

const PORT = 1111;

Deno.test("Pokedex responds with Pokemon", async () => {
  await using pokedex = new Pokedex(PORT);
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/mewtwo"),
    HttpResponse.ok({ name: "mewtwo" }),
  );
});

Deno.test("Pokedex responds with not found when the Pokemon does not exist", async () => {
  await using pokedex = new Pokedex(PORT);
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/rony"),
    HttpResponse.notFound(),
  );
});
