import { FileNode, FolderNode, Node, NotExistNode, Roots } from "./types.ts";
import { rgb24 } from "std/fmt/colors.ts";

export class NodeFormatter {
  public fileNodeColor = 0x00FFFF;

  public folderNodeColor = 0xFF00FF;

  public notExistNodeColor = 0xCCFFFF;

  public levelSpaces: number = 2;

  private lineFeed = "\n";

  public nodeToCliString(roots: Roots): string {
    let res = roots.roots
      .map((root) => this.formatNode(0, root))
      .reduce((a, b) => a + b, "");
    if (roots.roots.length < roots.count) {
      res += `... (${roots.count} entries in total)` + this.lineFeed;
    }
    return res;
  }

  private formatNode(level: number, node: Node): string {
    if (node.type === "folder") {
      return this.formatFolder(level, node);
    } else if (node.type === "file") {
      return this.formatFile(level, node);
    } else if (node.type === "not_exist") {
      return this.formatNotExistNode(level, node);
    } else {
      throw new Error(`Node type not exist: ${(node as Node).type}`);
    }
  }

  private formatFile(level: number, node: FileNode): string {
    return this.spaces(level) + rgb24(node.path, this.fileNodeColor) +
      this.lineFeed;
  }

  private formatNotExistNode(level: number, node: NotExistNode): string {
    return this.spaces(level) +
      rgb24(node.path + " [Not exist]", this.notExistNodeColor) + this.lineFeed;
  }

  private formatFolder(level: number, node: FolderNode): string {
    return this.spaces(level) +
      rgb24(node.path, this.folderNodeColor) +
      ` (${node.childrenCount} in total)` + this.lineFeed +
      node.children.map((n) => this.formatNode(level + 1, n));
  }

  private spaces(level: number): string {
    return " ".repeat(level * this.levelSpaces);
  }
}
