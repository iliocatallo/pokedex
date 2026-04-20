import { Support } from "@app/Support.ts";

export class SupportOnCall implements Support {
  onResponse(info: Record<string, unknown>): void {
    console.log(JSON.stringify(info));
  }
}
