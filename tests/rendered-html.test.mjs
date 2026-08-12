import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the K.A.F.A. prototype shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /K\.A\.F\.A\./);
  assert.match(html, /Aceh Utara/);
  assert.match(html, /Krueng Keureuto/);
  assert.match(html, /Prototype - simulated data for demonstration purposes\./);
  assert.match(html, /Overview/);
  assert.match(html, /Real-Time CCTV/);
  assert.match(html, /Flood Risk Management/);
  assert.match(html, /Rescue Priority Management/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|Kuala Lumpur/i);
});
