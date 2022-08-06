interface NodeBase {
  /**
   * relative path to parent node. If it is root node, path should be absolute path.
   */
  path: string;
}

export interface NotExistNode extends NodeBase {
  type: "not_exist";
}

export interface FileNode extends NodeBase {
  type: "file";
}

export interface SymbolLinkNode extends NodeBase {
  type: "symbol_link";
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

export type Node = FileNode | FolderNode | NotExistNode | SymbolLinkNode;

export interface Roots {
  roots: Node[];
  count: number;
}
