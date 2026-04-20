import { Support } from "@app/Support.ts";

export class RecordingSupport implements Support {
  private responses: Record<string, unknown>[] = [];
  private errors: Record<string, unknown>[] = [];

  onResponse(info: Record<string, unknown>): void {
    this.responses.push(info);
  }

  onError(info: Record<string, unknown>): void {
    this.errors.push(info);
  }

  async theLogFor(
    action: () => Promise<unknown>,
  ): Promise<Record<string, unknown>> {
    const before = this.responses.length;
    await action();
    return this.responses[before] ?? { no: "logs" };
  }

  async theErrorLogFor(
    action: () => Promise<unknown>,
  ): Promise<Record<string, unknown>> {
    const before = this.errors.length;
    await action();
    return this.errors[before] ?? { no: "error logs" };
  }
}
