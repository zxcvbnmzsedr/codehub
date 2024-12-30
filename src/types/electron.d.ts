export interface ServerForm {
  id: string
  name: string
  host: string
  port: string
  username: string
  password?: string
  authType?: "password" | "key" | "cert" | "ask"
  privateKey?: string
  passphrase?: string
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
  loadServers: (categoryId: string) => ServerForm[]
  createServer: (server: Server) => void
  updateServer: (server: Server) => void
  deleteServer: (id: string, categoryId: string) => void

  // Databases
  loadDatabases: (categoryId: string) => Database[]
  createDatabase: (database: Database) => void
  updateDatabase: (database: Database) => void
  deleteDatabase: (id: string, categoryId: string) => void

  // Credentials
  loadCredentials: (categoryId: string) => Credential[]
  createCredential: (credential: Credential) => void
  updateCredential: (credential: Credential) => void
  deleteCredential: (id: string, categoryId: string) => void

  // Utils
  openExternal: (url: string) => void
  copyToClipboard: (text: string) => void

  // Server
  testServerConnection: (server: ServerForm) => Promise<{ success: boolean; message: string }>
  loadDefaultSSHKey: () => Promise<string>
  loadSSHKeyFromFile: () => Promise<string>

  // SSH
  connectSSH: (serverInfo: ServerForm) => Promise<boolean>
  writeSSH: (serverId: string, data: string) => void
  onSSHData: (callback: (data: string) => void) => void
  disconnectSSH: (serverId: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
