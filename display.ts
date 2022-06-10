import { FileNode, FolderNode, Node, NotExistNode, Roots } from "./types.ts";
import { rgb24 } from "std/fmt/colors.ts";

export class NodeFormatter {
  public fileNodeColor = 0x00FFFF;

  public folderNodeColor = 0xFF00FF;

  public notExistNodeColor = 0xCCFFFF;

  public levelSpaces: number = 2;

  private lineFeed = "\n";

  public nodeToCliString(roots: Roots): string {
    return [
      ...roots.roots.map((root) => this.formatNode(0, root)).flat(),
      `... (${roots.count} entries in total)`,
    ].join(this.lineFeed);
  }

  private formatNode(level: number, node: Node): string[] {
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

  private formatFile(level: number, node: FileNode): string[] {
    return [
      this.spaces(level) + rgb24(node.path, this.fileNodeColor),
    ];
  }

  private formatNotExistNode(level: number, node: NotExistNode): string[] {
    return [
      this.spaces(level) +
      rgb24(node.path + " [Not exist]", this.notExistNodeColor),
    ];
  }

  private formatFolder(level: number, node: FolderNode): string[] {
    return [
      this.spaces(level) +
      rgb24(node.path, this.folderNodeColor) +
      ` (${node.childrenCount} in total)`,
      ...node.children.map((n) => this.formatNode(level + 1, n)).flat(),
    ];
  }

  private spaces(level: number): string {
    return " ".repeat(level * this.levelSpaces);
  }
}
