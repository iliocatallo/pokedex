import { HttpResponse } from "@app/HttpResponse.ts";

export const Http = {
  async callOn(port: number, path: string = "/") {
    const res = await fetch("http://localhost:" + port + path);
    const contentType = res.headers.get("content-type");
    if (contentType !== null) {
      const content = await res.text();
      return new HttpResponse(res.status, { contentType, content });
    }
    res.body?.cancel();
    return new HttpResponse(res.status);
  },
};
