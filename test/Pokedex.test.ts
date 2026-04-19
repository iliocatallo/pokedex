import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";

const PORT = 1111;

Deno.test("Pokedex responds with Pokemon", async () => {
  await using pokedex = new Pokedex(PORT);
  await pokedex.ready;

  const res = await fetch("http://localhost:" + PORT + "/pokemon/mewtwo");

  assertEquals(await res.json(), { name: "mewtwo" });
});

Deno.test("Pokedex responds with not found when the Pokemon does not exist", async () => {
  await using pokedex = new Pokedex(PORT);
  await pokedex.ready;

  const res = await fetch("http://localhost:" + PORT + "/pokemon/rony");

  assertEquals(res.status, 404);
  await res.body?.cancel();
});
