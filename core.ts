import { FolderNode, Node } from "./types.ts";

import { join, resolve } from "std/path/mod.ts";

export class ConfirmRmCore {
  private maxRootNumber = 5;
  private maxChildrenNumber = 3;

  public constructor(private paths: string[]) {
  }

  public async generateTree(): Promise<Node[]> {
    if (this.paths.length >= this.maxRootNumber) {
      return this.getApproximateTrees();
    }

    return this.getDetailedTrees();
  }

  private getDetailedTrees(): Promise<Node[]> {
    return Promise.all(this.paths.map((path) =>
      this.toNode(
        this.toFolderNode.bind(this),
        resolve(path),
      )
    ));
  }

  private getApproximateTrees(): Promise<Node[]> {
    return Promise.all(
      this.paths
        .slice(0, this.maxRootNumber)
        .map((path) =>
          this.toNode(
            this.toFolderNodeWithoutChildren.bind(this),
            resolve(path),
          )
        ),
    );
  }

  private async toNode(
    folderHandler: (path: string, parent?: string) => Promise<Node>,
    path: string,
    parent?: string,
  ): Promise<Node> {
    const fullPath = parent ? resolve(parent, path) : path;

    try {
      const stat = await Deno.stat(fullPath);
      if (stat.isDirectory) {
        return folderHandler(path, parent);
      } else {
        return {
          type: "file",
          path,
        };
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return {
          type: "not_exist",
          path,
        };
      }
      throw error;
    }
  }

  private async toFolderNodeWithoutChildren(
    path: string,
    parent?: string,
  ): Promise<FolderNode> {
    const fullPath = parent ? resolve(parent, path) : path;
    return {
      type: "folder",
      path,
      children: [],
      childrenCount: await this.countChildren(fullPath),
    };
  }

  private async toFolderNode(
    path: string,
    parent?: string,
  ): Promise<FolderNode> {
    const fullPath = parent ? resolve(parent, path) : path;

    const children: Node[] = [];
    for await (const file of await Deno.readDir(fullPath)) {
      if (children.length >= this.maxChildrenNumber) {
        break;
      }

      children.push({
        path: file.name,
        ...(file.isDirectory
          ? {
            type: "folder",
            childrenCount: await this.countChildren(join(fullPath, file.name)),
            children: [],
          }
          : {
            type: "file",
          }),
      });
    }

    return {
      type: "folder",
      path,
      children: [],
      childrenCount: await this.countChildren(path),
    };
  }

  private async countChildren(path: string): Promise<number> {
    let count = 0;
    for await (const _ of Deno.readDir(path)) {
      ++count;
    }
    return count;
  }
}
