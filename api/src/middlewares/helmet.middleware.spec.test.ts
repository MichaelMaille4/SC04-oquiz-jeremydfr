import assert from "node:assert";
import { describe, it } from "node:test";
import { authedRequester } from "../../test/index.ts";

describe("Helmet middleware", () => {
  it("should remove unsafe headers from API response", async () => {
    const { headers } = await authedRequester.get("/levels");
    
    assert.equal(headers['x-powered-by'], undefined);
  });
});
