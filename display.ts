import {
  FileNode,
  FolderNode,
  Node,
  NotExistNode,
  Roots,
  SymbolLinkNode,
} from "./types.ts";
import { rgb24 } from "std/fmt/colors.ts";

export class NodeFormatter {
  public fileNodeColor = 0x00FFFF;

  public symbolLinkNodeColor = 0x00FFFF;

  public folderNodeColor = 0xFF00FF;

  public notExistNodeColor = 0xCCFFFF;

  public levelSpaces = 4;

  private lineFeed = "\n";

  public nodeToCliString(roots: Roots): string {
    const lines = roots.roots.map((root) => this.formatNode(0, root)).flat();
    if (roots.roots.length < roots.count) {
      lines.push(`... and ${roots.count - roots.roots.length} more entry(s)`);
    }
    return lines.join(this.lineFeed);
  }

  private formatNode(level: number, node: Node): string[] {
    if (node.type === "folder") {
      return this.formatFolder(level, node);
    } else if (node.type === "file") {
      return this.formatFile(level, node);
    } else if (node.type === "symbol_link") {
      return this.formatSymbolLink(level, node);
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
  private formatSymbolLink(level: number, node: SymbolLinkNode): string[] {
    return [
      this.spaces(level) + rgb24(node.path, this.symbolLinkNodeColor),
    ];
  }

  private formatNotExistNode(level: number, node: NotExistNode): string[] {
    return [
      this.spaces(level) +
      rgb24(node.path + " [Not exist]", this.notExistNodeColor),
    ];
  }

  private formatFolder(level: number, node: FolderNode): string[] {
    const lines = [
      this.spaces(level) + rgb24(node.path, this.folderNodeColor),
      ...node.children.map((n) => this.formatNode(level + 1, n)).flat(),
    ];

    const realChildrenNum = node.childrenCount;
    const displayedChildrenNum = node.children.length;
    if (displayedChildrenNum < realChildrenNum) {
      lines.push(
        `${this.spaces(level + 1)}... and ${
          realChildrenNum - displayedChildrenNum
        } more file(s)`,
      );
    }

    return lines;
  }

  private spaces(level: number): string {
    return " ".repeat(level * this.levelSpaces);
  }
}
