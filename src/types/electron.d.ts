interface ElectronAPI {
  loadCategories: () => any[]
  saveCategories: (categories: any) => boolean
}

interface Window {
  electronAPI: ElectronAPI
}
