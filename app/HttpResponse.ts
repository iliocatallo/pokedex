import { ResponseToolkit } from "@hapi/hapi";

export class HttpResponse {
  constructor(public statusCode: number, public body?: Body) {}

  static ok(json: Json) {
    return new HttpResponse(200, {
      contentType: "application/json; charset=utf-8",
      content: JSON.stringify(json),
    });
  }

  static notFound() {
    return new HttpResponse(404);
  }

  writeTo(h: ResponseToolkit) {
    const response = this.body
      ? h.response(this.body.content).type(this.body.contentType)
      : h.response();

    return response.code(this.statusCode);
  }
}

type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | Partial<{ [key: string]: Json }>;

type Body = { contentType: string; content: string };
