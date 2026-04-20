# Pokedex

A REST API that returns Pokemon information, with optional
Yoda/Shakespeare-styled descriptions.

## Prerequisites

Deno 2.x or later (see the
[installation instructions](https://docs.deno.com/runtime/getting_started/installation/)).

On macOS, port `5000` is used by the AirPlay Receiver service by default. Either
disable it under _System Settings → General → AirDrop & Handoff → AirPlay
Receiver_, or run the server on a different port (see below).

## How to run

```sh
deno run --allow-net --allow-env --allow-sys main.ts
```

The server starts on port `5000` by default. To use a different port:

```sh
PORT=8080 deno run --allow-net --allow-env --allow-sys main.ts
```

### Run with Docker

```sh
docker build -t pokedex .
docker run -p 5000:5000 pokedex
```

## Try it

Once the server is running, hit the endpoints with [HTTPie](https://httpie.io/):

```sh
http http://localhost:5000/pokemon/mewtwo
http http://localhost:5000/pokemon/translated/mewtwo
```

### Health check

```sh
http http://localhost:5000/health
```

Returns `200 OK` when the Pokemon Index is reachable, `503 Service Unavailable`
otherwise.

## Production considerations

**Caching**. The FunTranslations response cache is in-memory, which works fine
for a single instance and mitigates the upstream quota (on `429` the service
falls back to the standard description). Under horizontal scaling, a shared
cache would prevent redundant API calls across instances and could be warmed
off-peak with popular Pokemon, shifting quota usage away from request time.
Additionally, since Pokemon data is stable, setting `Cache-Control` headers on
responses would let clients and CDNs cache results, reducing load on all
external services without any server-side state.

**Circuit breaker**. Retry logic is in place, but a circuit breaker would open
after repeated failures and stop calling the external service entirely for a
period, keeping response times predictable instead of waiting on timeouts for
every request while a dependency is down.

**Timeouts**. Outbound request timeouts (3s for PokeAPI, 6s for FunTranslations)
are set by rough intuition. In production they'd be derived from observed
latency percentiles.

**Configuration**. API base URLs are currently hardcoded. Moving them to
environment variables decouples configuration from code: the same artifact can
run in staging and production pointing at different external services, and
changing a URL no longer requires a code change. That said, env vars still
require a restart to take effect.

**Health checks**. `/health` reports readiness; as such, it fails when PokeAPI
is unreachable, so the orchestrator can stop routing traffic. A separate
liveness endpoint, independent of dependencies, would be needed to let the
orchestrator decide when to restart the pod.

**HTTPS**. The server speaks plain HTTP. In production, TLS termination would
sit in front.

**Rate limiting**. No inbound rate limits are enforced. In production this would
sit at the edge (API gateway or ingress) rather than in the service itself.

**CORS**. No CORS headers are set. If a browser client is expected to consume
this API directly, the allowed origins, methods, and headers would need to be
configured explicitly.

**Observability**. The service logs HTTP responses and errors to stdout/stderr,
assuming a collection agent on the platform ships them to an aggregator. No
metrics are exposed, and no domain-level events are emitted: in a richer service
these would capture meaningful business outcomes rather than low-level activity.

## Development

### Run tests

```sh
deno test --allow-net --allow-env --allow-sys
```
