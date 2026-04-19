import { Pokedex } from "@app/Pokedex.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "5000");

await using pokedex = new Pokedex(PORT);
await pokedex.ready;

const SIGTERM = new Promise<void>((r) => Deno.addSignalListener("SIGTERM", r));
const SIGINT = new Promise<void>((r) => Deno.addSignalListener("SIGINT", r));
await Promise.race([SIGTERM, SIGINT]);
