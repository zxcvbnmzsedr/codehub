export interface Ccategories {
  id: string
  name: string
  parentId?: string
  children?: Ccategories[]
  expanded?: boolean
}

export type CreateDirectoryPayload = {
  name: string
  type: "document" | "folder"
  parentPath: string
}
