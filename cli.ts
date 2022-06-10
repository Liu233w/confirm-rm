import { ConfirmRmCore } from "./mod.ts";
import { NodeFormatter } from "./display.ts";

const core = new ConfirmRmCore(Deno.args);
const tree = await core.generateTree();

console.log("Will delete files and folders:");

const formatter = new NodeFormatter();
console.log(formatter.nodeToCliString(tree));

const input = prompt("Proceed? [Y/n]: ", "");
const confirmd = ["y", "Y", "yes", "Yes", "", null].includes(input);

if (confirmd) {
  for (const root of tree.roots) {
    await Deno.remove(root.path, { recursive: true });
  }
}
