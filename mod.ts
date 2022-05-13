import {
  basename,
  dirname,
  resolve,
} from "std/path/mod.ts";

import { } from "std/fs/mod.ts";

interface NodeBase {
  /**
   * Relative path to parent node.
   *
   * If undefined, it is the direct child of parent node.
   */
  relativePath?: string;
  name: string;
}

export interface FileNode extends NodeBase {
  type: "file";
}

export interface FolderNode extends NodeBase {
  type: "folder";

  /**
   * The children that will be displayed on console
   */
  children: Node[];

  /**
   * The number of all children that will be deleted.
   *
   * It can be bigger than children.length
   */
  childrenCount: number;
}

export type Node = FileNode | FolderNode;

export interface FileTree {
  basePath: string;
  root: Node;
}

export async function generateTree(
  workDir: string,
  paths: string[],
): Promise<FileTree[]> {
  return paths.map((path) => {
    const loc = resolve(workDir, path);
    const dir = dirname(loc);
    const name = basename(loc);
    return {
      basePath: dir,
      root: {
        type: "file",
        name: name,
      },
    };
  });
}

function walkTree(path: string): FileTree {
  throw new Error("unimplemented");
}

export async function mergeBase(trees: FileTree[]): Promise<FileTree[]> {
  throw new Error("unimplemented");
}
