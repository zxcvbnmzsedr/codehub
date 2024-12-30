export interface Server {
  id: string
  name: string
  host: string
  port: string | number
  categoryId: string
}

export interface Database {
  id: string
  name: string
  openMethod: string
  categoryId: string
}

export interface Account {
  role: string
  username: string
  password: string
}

export interface Credential {
  id: string
  title: string
  url: string
  accounts: Account[]
  categoryId: string
}

export interface ElectronAPI {
  // Categories
  loadCategories: () => any[]
  saveCategories: (categories: any) => boolean

  // Servers
  loadServers: (categoryId: string) => Server[]
  createServer: (server: Server) => void
  updateServer: (server: Server) => void
  deleteServer: (id: string) => void

  // Databases
  loadDatabases: (categoryId: string) => Database[]
  createDatabase: (database: Database) => void
  updateDatabase: (database: Database) => void
  deleteDatabase: (id: string) => void

  // Credentials
  loadCredentials: (categoryId: string) => Credential[]
  createCredential: (credential: Credential) => void
  updateCredential: (credential: Credential) => void
  deleteCredential: (id: string) => void

  // Utils
  openExternal: (url: string) => void
  copyToClipboard: (text: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
