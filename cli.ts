import { join } from "std/path/mod.ts";

import { ConfirmRmCore } from "./mod.ts";
import { debugAssert } from "./test_utils.ts";
import { NodeFormatter } from "./display.ts";

const core = new ConfirmRmCore(Deno.args);
const tree = await core.generateTree();

console.log("Will delete files and folders:");

const formatter = new NodeFormatter();
console.log(formatter.nodeToCliString(tree));

const input = prompt("Proceed? [Y/n]: ", "");
const confirm = ["y", "Y", "yes", "Yes", "", null].includes(input);

// TODO: delete
