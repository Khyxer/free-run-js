/* eslint-disable */
import Split from 'split.js'
import * as monaco from 'monaco-editor'
import { editorThemes } from './themes.js'

// Detectar el tema antes de cualquier otra inicialización
const savedTheme = localStorage.getItem('theme') || 'synthwave84'
const loadingScreen = document.getElementById('loading-screen')

const THEME_BACKGROUNDS = {
  dracula: '#282A36',
  monokai: '#272822',
  synthwave84: '#262335',
  vscodeDark: '#1E1E1E',
  xcodeLight: '#FFFFFF',
  coldarkCold: '#E3E9F2'
}

const backgroundColor = THEME_BACKGROUNDS[savedTheme] || THEME_BACKGROUNDS['synthwave84']
if (loadingScreen) {
  loadingScreen.style.backgroundColor = backgroundColor
  // Ajustar el color del texto en caso de temas claros
  if (savedTheme === 'xcodeLight' || savedTheme === 'coldarkCold') {
    const loadingText = loadingScreen.querySelector('.loading-text')
    if (loadingText) {
      loadingText.style.color = '#333333'
    }
    const loadingSpinner = loadingScreen.querySelector('.loading-spinner')
    if (loadingSpinner) {
      loadingSpinner.style.borderTop = '5px solid #333333'
    }
  }
}

// Constantes
const STORAGE_KEY = 'editor_code'
const DEFAULT_THEME = 'synthwave84'
const DEFAULT_SETTINGS = {
  fontSize: 20,
  tabSize: 2,
  wrap: true,
  lineNumbers: true,
  miniMap: false
}

// Referencias DOM
const codeContainer = document.getElementById('code')
const consoleOutput = document.getElementById('console')

/**
 * Inicializa el entorno del editor
 */
function initializeEditor() {
  // Inicializar Split.js para el panel dividido
  Split(['#split-0', '#split-1'], {
    gutterSize: 20
  })

  // Configurar redirección de consola
  setupConsoleRedirect()

  // Obtener configuraciones guardadas
  const savedCode = getSavedCode()
  const theme = localStorage.getItem('theme') || DEFAULT_THEME
  const userSettings = getEditorSettings()

  // Inicializar Monaco Editor
  const editor = createEditor(savedCode, theme, userSettings)

  // Inicializar el worker de Monaco
  setupMonacoWorker()

  // Ejecutar el código inicialmente tras cargar
  setTimeout(() => executeCode(editor), 500)

  // Establecer eventos de cambio en el editor
  setupEditorEvents(editor)

  // Guardar antes de cerrar la aplicación
  window.addEventListener('beforeunload', () => saveCode(editor))

  // Ocultar la pantalla de carga cuando todo está listo
  hideLoadingScreen()

  // Retornar la instancia del editor para uso externo
  return editor
}

/**
 * Oculta la pantalla de carga con una animación suave
 */
function hideLoadingScreen() {
  if (loadingScreen) {
    // Primeramente hacer una transición suave
    loadingScreen.style.opacity = '0'
    loadingScreen.style.pointerEvents = 'none' // Desactivar eventos para evitar interacciones durante la transición

    // Después de la transición, ocultar completamente
    setTimeout(() => {
      loadingScreen.style.display = 'none'
    }, 300) // Este tiempo debe coincidir con la duración de la transición CSS
  }
}

/**
 * Recupera configuraciones del editor desde localStorage
 */
function getEditorSettings() {
  try {
    const settingsJson = localStorage.getItem('settings')
    if (!settingsJson) return DEFAULT_SETTINGS

    const userSettings = JSON.parse(settingsJson)
    return {
      fontSize: userSettings.fontSize || DEFAULT_SETTINGS.fontSize,
      tabSize: userSettings.tabSize || DEFAULT_SETTINGS.tabSize,
      wrap: userSettings.wrap !== undefined ? userSettings.wrap : DEFAULT_SETTINGS.wrap,
      lineNumbers:
        userSettings.lineNumbers !== undefined
          ? userSettings.lineNumbers
          : DEFAULT_SETTINGS.lineNumbers,
      miniMap: userSettings.miniMap !== undefined ? userSettings.miniMap : DEFAULT_SETTINGS.miniMap
    }
  } catch (error) {
    console.error('Error parsing settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * Recupera el código guardado en localStorage
 */
function getSavedCode() {
  return localStorage.getItem(STORAGE_KEY) || ''
}

/**
 * Crea una instancia del editor Monaco
 */
function createEditor(savedCode, theme, settings) {
  return monaco.editor.create(codeContainer, {
    value: savedCode,
    language: 'javascript',
    theme: theme,
    minimap: { enabled: settings.miniMap },
    automaticLayout: true,
    fontSize: settings.fontSize,
    tabSize: settings.tabSize,
    scrollBeyondLastLine: false,
    wordWrap: settings.wrap ? 'on' : 'off',
    lineNumbers: settings.lineNumbers ? 'on' : 'off',
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    lineNumbersMinChars: 3,
    scrollbar: {
      verticalScrollbarSize: 0
    }
  })
}

/**
 * Configura el worker de Monaco
 */
function setupMonacoWorker() {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'javascript' || label === 'typescript') {
        return new Worker(
          new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
          { type: 'module' }
        )
      }
      return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), {
        type: 'module'
      })
    }
  }
}

/**
 * Configura la redirección de la consola
 */
function setupConsoleRedirect() {
  // Crear contenedor para mensajes si no existe
  if (!consoleOutput.querySelector('.console-messages')) {
    const messagesContainer = document.createElement('div')
    messagesContainer.className = 'console-messages'
    messagesContainer.style.fontFamily = 'monospace'
    messagesContainer.style.whiteSpace = 'pre-wrap'
    messagesContainer.style.padding = '10px'
    messagesContainer.style.height = '100%'
    messagesContainer.style.overflow = 'auto'
    consoleOutput.appendChild(messagesContainer)
  }

  const consoleMessages = consoleOutput.querySelector('.console-messages')

  // Guardar métodos originales de la consola
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  }

  /**
   * Formatea un valor para mostrarlo en la consola
   */
  const formatValue = (value) => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'function') {
      return `[Function: ${value.name || 'anonymous'}]`
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch (e) {
        return String(value)
      }
    }
    return String(value)
  }

  /**
   * Añade un mensaje a la consola visual
   */
  const appendToConsole = (type, ...args) => {
    const message = document.createElement('div')
    message.className = `console-${type}`

    // Aplicar estilos según el tipo de mensaje
    const colors = {
      error: '#ff5555',
      warn: '#ffb86c',
      info: '#8be9fd',
      log: '#72F1B8'
    }

    message.style.color = colors[type] || colors.log

    // Formatear y mostrar todos los argumentos
    const formattedArgs = args.map(formatValue).join(' ')
    message.textContent = formattedArgs

    consoleMessages.appendChild(message)
    consoleMessages.scrollTop = consoleMessages.scrollHeight

    // Mantener el log en la consola del navegador para debug
    originalConsole[type](...args)
  }

  // Sobrescribir los métodos de la consola
  console.log = (...args) => appendToConsole('log', ...args)
  console.error = (...args) => appendToConsole('error', ...args)
  console.warn = (...args) => appendToConsole('warn', ...args)
  console.info = (...args) => appendToConsole('info', ...args)
}

/**
 * Guarda el código en localStorage
 */
function saveCode(editor) {
  const code = editor.getValue()
  localStorage.setItem(STORAGE_KEY, code)
}

/**
 * Ejecuta el código del editor
 */
function executeCode(editor) {
  // Limpiar el historial de la consola
  const consoleMessages = consoleOutput.querySelector('.console-messages')
  consoleMessages.innerHTML = ''

  try {
    const code = editor.getValue()
    // Usar Function para aislar el alcance de las variables
    const runCode = new Function(code)
    runCode()
  } catch (error) {
    console.error(`Error executing code: ${error.message}`)
  }
}

/**
 * Configura eventos en el editor
 */
function setupEditorEvents(editor) {
  let executeTimer = null
  let saveTimer = null

  editor.onDidChangeModelContent(() => {
    // Limpiar el temporizador de ejecución anterior
    if (executeTimer) {
      clearTimeout(executeTimer)
    }

    executeTimer = setTimeout(() => executeCode(editor), 400)

    // Limpiar el temporizador de guardado anterior
    if (saveTimer) {
      clearTimeout(saveTimer)
    }

    saveTimer = setTimeout(() => saveCode(editor), 300)
  })
}

// Inicializar el editor cuando se carga el documento
// Aseguramos que todas las configuraciones se carguen antes
// de inicializar el editor
const editorInstance = initializeEditor()

// Exportar la instancia para uso en otros archivos

// Exportar la instancia del editor para uso en otros archivos
export default editorInstance
