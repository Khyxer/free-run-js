/* eslint-disable */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/logo-free-run-js.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Free Run JS',
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    show: false,
    webSecurity: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })


  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-change', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-change', false)
  })

  // Configurar IPC para responder a consultas sobre el estado de la ventana
  ipcMain.handle('is-window-maximized', () => {
    return mainWindow.isMaximized()
  })

  ipcMain.handle('toggle-maximize-window', () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (!mainWindow) return

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle('minimize-window', () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (!mainWindow) return
    mainWindow.minimize()
  })

  ipcMain.handle('close-window', () => {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (!mainWindow) return
    mainWindow.close()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.maximize()
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.freerunjs')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
