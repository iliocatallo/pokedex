FROM denoland/deno:2.7.12

WORKDIR /app

COPY deno.json deno.lock ./
COPY app/ ./app/
COPY main.ts ./

RUN deno cache main.ts

EXPOSE 5000

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-sys", "main.ts"]