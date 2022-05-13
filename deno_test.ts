import { join } from "std/path/mod.ts";
import { assert, assertFalse } from "std/testing/asserts.ts";

const { test } = Deno;

test("Deno.remove", {
  permissions: { read: true, write: true },
}, async ({ step }) => {
  let temp: string;

  await step("do not follow symbol link for recursive delete", async () => {
    // arrange
    temp = await Deno.makeTempDir({ prefix: "confirm-rm-test_" });
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

  await step("cleanup", () => Deno.remove(temp, { recursive: true }));
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
