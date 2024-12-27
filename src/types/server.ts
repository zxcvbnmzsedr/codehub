export interface Directory {
  id: string
  name: string
  type: "document" | "folder"
  children?: Directory[]
  expanded?: boolean
  path: string
}

export type CreateDirectoryPayload = {
  name: string
  type: "document" | "folder"
  parentPath: string
}
