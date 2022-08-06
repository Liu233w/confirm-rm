import { afterEach, beforeEach, describe, it } from "std/testing/bdd.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertObjectMatch,
} from "std/testing/asserts.ts";
import { join } from "std/path/mod.ts";
import { ConfirmRmCore } from "./core.ts";
import { FolderNode } from "./types.ts";

describe("core function", { permissions: { read: true, write: true } }, () => {
  let TEST_DIR: string;

  beforeEach(async () => {
    TEST_DIR = await Deno.makeTempDir({ prefix: "confirm-rm-test_" });
  });

  afterEach(async () => {
    await Deno.remove(TEST_DIR, { recursive: true });
  });

  describe("generateTree", () => {
    it("can list root trees", async () => {
      await createFiles(["1", "2"]);

      const core = new ConfirmRmCore([
        join(TEST_DIR, "1"),
        join(TEST_DIR, "2"),
      ]);
      const roots = await core.generateTree();

      assertEquals(roots.count, 2);
      assertEquals(roots.roots.length, 2);
      assertEquals(
        roots.roots.sort(),
        [
          {
            type: "file",
            path: join(TEST_DIR, "1"),
          },
          {
            type: "file",
            path: join(TEST_DIR, "2"),
          },
        ].sort(),
      );
    });

    it("does not list too many root trees", async () => {
      const names = ["1", "2", "3", "4", "5", "6"];
      const paths = names.map((n) => join(TEST_DIR, n));
      await createFiles(names);

      const core = new ConfirmRmCore(paths);
      const roots = await core.generateTree();

      assertEquals(roots.count, 6);
      assertEquals(roots.roots.length, 5);
      for (const root of roots.roots) {
        assertEquals(root.type, "file");
        assertArrayIncludes(paths, [root.path]);
      }
    });

    it("can list child files", async () => {
      await createFiles(["1.txt", "2.txt"]);

      const core = new ConfirmRmCore([
        TEST_DIR,
      ]);
      const roots = await core.generateTree();

      assertEquals(roots.count, 1);
      assertEquals(roots.roots.length, 1);
      assertObjectMatch(roots.roots[0], {
        type: "folder",
        path: TEST_DIR,
        childrenCount: 2,
      });
      assertArrayIncludes((roots.roots[0] as FolderNode).children, [
        {
          type: "file",
          path: "1.txt",
        },
        {
          type: "file",
          path: "2.txt",
        },
      ]);
    });

    it("does not show too many child files", async () => {
      const names = ["1", "2", "3", "4", "5", "6"];
      await createFiles(names);

      const core = new ConfirmRmCore([
        TEST_DIR,
      ]);
      const roots = await core.generateTree();

      assertEquals(roots.count, 1);
      assertEquals(roots.roots.length, 1);
      assertObjectMatch(roots.roots[0], {
        type: "folder",
        path: TEST_DIR,
        childrenCount: 6,
      });
      for (const root of (roots.roots[0] as FolderNode).children) {
        assertEquals(root.type, "file");
        assertArrayIncludes(names, [root.path]);
      }
    });

    it("shows soft link correctly", async () => {
      // arrange
      const realPath = join(TEST_DIR, "real");
      await Deno.mkdir(realPath);

      for (const file of ["1.txt", "2.txt"]) {
        const f = await Deno.create(join(realPath, file));
        f.close();
      }

      const symbolPath = join(TEST_DIR, "symbol");
      await Deno.symlink(realPath, symbolPath);

      // act
      const core = new ConfirmRmCore([
        symbolPath,
      ]);
      const roots = await core.generateTree();

      // assert
      assertEquals(roots.count, 1);
      assertEquals(roots.roots.length, 1);
      assertObjectMatch(roots.roots[0], {
        type: "symbol_link",
        path: symbolPath,
      });
    });
  });

  async function createFiles(files: string[]) {
    for (const file of files) {
      const f = await Deno.create(join(TEST_DIR, file));
      f.close();
    }
  }
});
