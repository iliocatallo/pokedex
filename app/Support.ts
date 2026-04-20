export interface Support {
  onResponse(info: Record<string, unknown>): void;
}

// deno-lint-ignore no-namespace
export namespace Support {
  export const absent: Support = {
    onResponse() {},
  };
}
