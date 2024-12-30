export interface Ccategories {
  id: string
  name: string
  type: "document" | "folder"
  parentId: string
  children?: Ccategories[]
  expanded?: boolean
  path: string
}

export type CreateDirectoryPayload = {
  name: string
  type: "document" | "folder"
  parentPath: string
}
