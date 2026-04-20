import { assertEquals, assertObjectMatch } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";
import { HttpResponse } from "@app/HttpResponse.ts";
import { Http } from "./Http.ts";
import { EmptyPokemonIndex } from "./testdoubles/EmptyPokemonIndex.ts";
import { AlwaysFoundPokemonIndex } from "./testdoubles/AlwaysFoundPokemonIndex.ts";
import { WhateverDescriptionStyle } from "./testdoubles/WhateverDescriptionStyle.ts";
import { HealthyPokemonIndex } from "./testdoubles/HealthyPokemonIndex.ts";
import { UnhealthyPokemonIndex } from "./testdoubles/UnhealthyPokemonIndex.ts";
import { RecordingSupport } from "./testdoubles/RecordingSupport.ts";

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

Deno.test("Pokedex responds with translated Pokemon", async () => {
  const index = new AlwaysFoundPokemonIndex();
  const style = new WhateverDescriptionStyle();
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: index,
    styledWith: style,
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/mewtwo"),
    HttpResponse.ok(await index.lookup("mewtwo", style)),
  );
});

Deno.test("Pokedex responds with not found when the translated Pokemon does not exist", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new EmptyPokemonIndex(),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/rony"),
    HttpResponse.notFound(),
  );
});

Deno.test("Pokedex responds with “ok” on the health endpoint when index is ready", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new HealthyPokemonIndex(),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/health"),
    HttpResponse.ok({ status: "ok" }),
  );
});

Deno.test("Pokedex responds with “unavailable” on the health endpoint when index is not ready", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new UnhealthyPokemonIndex(),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/health"),
    HttpResponse.serviceUnavailable({ status: "unavailable" }),
  );
});

Deno.test("Pokedex passes request info to support", async () => {
  const support = new RecordingSupport();
  await using pokedex = new Pokedex({
    onPort: PORT,
    monitoredBy: support,
    backedBy: new EmptyPokemonIndex(),
  });
  await pokedex.ready;

  assertObjectMatch(
    await support.theLogFor(() => Http.callOn(PORT, "/pokemon/rony")),
    { method: "GET", path: "/pokemon/rony", statusCode: 404 },
  );
});
