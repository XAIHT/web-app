import { afterEach, expect, it, vi } from "vitest";
import { HttpClient } from "./http";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("serializes structured JSON bodies passed to post", async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ accepted: true }), { status: 200 }),
  );
  vi.stubGlobal("fetch", fetchMock);
  const body = { label: "Tlamatini", versions: ["1.88.0"], enabled: true };
  const client = new HttpClient("https://example.test");

  await expect(client.post("/releases", body)).resolves.toEqual({ accepted: true });
  expect(fetchMock).toHaveBeenCalledWith(
    "https://example.test/releases",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  );
});
