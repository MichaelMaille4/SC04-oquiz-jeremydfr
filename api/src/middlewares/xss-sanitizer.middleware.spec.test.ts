import { describe, it } from "node:test";
import { authedRequester } from "../../test/index.ts";
import assert from "node:assert";

describe("XSS sanitizer", () => {
  it("should prevent XSS attempts in request body", async () => {
    const SAFE_LEVEL = { name: "Je suis un level pas dangeureux" };
    const DANGEROUS_LEVEL = { name: "<script>alert('je te pique ton cookie à la récrée')</script>" };
    
    const { status: successStatus } = await authedRequester.post("/levels", SAFE_LEVEL);
    const { status: failStatus } = await authedRequester.post("/levels", DANGEROUS_LEVEL);

    assert.equal(successStatus, 201);
    assert.equal(failStatus, 400);
  });
});
