import { join } from "std/path/mod.ts";
import { assert, assertFalse } from "std/testing/asserts.ts";
import { afterEach, beforeEach, describe, it } from "std/testing/bdd.ts";

describe("Deno.remove", {
  permissions: { read: true, write: true },
}, () => {
  let temp: string;

  beforeEach(async () => {
    temp = await Deno.makeTempDir({ prefix: "confirm-rm-test_" });
  });

  afterEach(() => Deno.remove(temp, { recursive: true }));

  it("do not follow symbol link for recursive delete", async () => {
    // arrange
    const referred = join(temp, "referred");
    const test = join(temp, "test");

    await Deno.mkdir(referred);
    await Deno.mkdir(test);

    (await Deno.create(join(referred, "r1"))).close();
    (await Deno.create(join(referred, "r2"))).close();
    (await Deno.create(join(referred, "r3"))).close();

    (await Deno.create(join(test, "t1"))).close();

    await Deno.symlink(referred, join(test, "refpath"));

    // act
    Deno.remove(test, { recursive: true });

    // assert
    assertFalse(await exists(test));
    assert(await exists(referred));
    assert(await exists(join(referred, "r1")));
  });
});

async function exists(path: string) {
  try {
    await Deno.stat(path);
  } catch (error) {
    if (error && error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    }
  }
  return true;
}
