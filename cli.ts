import { join } from "std/path/mod.ts";

import { generateTree } from "./mod.ts";
import { debugAssert } from "./utils.ts";

const tree = await generateTree(Deno.cwd(), Deno.args);

console.log("Will delete files and folders:");

for (const file of tree) {
  debugAssert(file.root.type === "file");
  console.log(join(file.basePath, file.root.name));
}

const input = prompt("Proceed? [Y/n]: ", "");
const confirm = ["y", "Y", "yes", "Yes", "", null].includes(input);

// TODO: delete
