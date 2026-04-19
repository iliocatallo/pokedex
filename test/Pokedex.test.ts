import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";

const PORT = 1111;

Deno.test("Pokedex responds with Pokemon", async () => {
  await using pokedex = new Pokedex(PORT);
  await pokedex.ready;

  const res = await fetch("http://localhost:" + PORT + "/pokemon/mewtwo");

  assertEquals(await res.json(), { name: "mewtwo" });
});
