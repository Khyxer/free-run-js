import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Define nuestras APIs personalizadas
const api = {
  // Función para obtener el estado de la ventana
  isWindowMaximized: async () => {
    return await ipcRenderer.invoke('is-window-maximized')
  },
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-change', (_, isMaximized) => {
      callback(isMaximized)
    })
  },

  // Nuevas funciones para controlar la ventana
  toggleMaximizeWindow: () => {
    ipcRenderer.invoke('toggle-maximize-window')
  },
  minimizeWindow: () => {
    ipcRenderer.invoke('minimize-window')
  },
  closeWindow: () => {
    ipcRenderer.invoke('close-window')
  }
}

// Usa `contextBridge` para exponer APIs a renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api) // Exponer como api en lugar de electronAPI
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
