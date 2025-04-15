/* eslint-disable */
import Split from 'split.js'
import * as monaco from 'monaco-editor'
import { editorThemes } from './themes.js'

// Inicializar Split.js para el panel dividido
Split(['#split-0', '#split-1'], {
  gutterSize: 20
})

const codeContainer = document.getElementById('code')
const consoleOutput = document.getElementById('console')

const STORAGE_KEY = 'editor_code'

const setupConsoleRedirect = () => {
  //div para los mensajes en la consola por aparte por si algun dia cambio la ui y quiero añadir algun boton o algo asi del lado de la consola
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

  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  }

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

  // agregar el mensaje a la consola
  const appendToConsole = (type, ...args) => {
    const message = document.createElement('div')
    message.className = `console-${type}`

    // Aplicar estilos según el tipo de mensaje
    switch (type) {
      case 'error':
        message.style.color = '#ff5555'
        break
      case 'warn':
        message.style.color = '#ffb86c'
        break
      case 'info':
        message.style.color = '#8be9fd'
        break
      default:
        message.style.color = '#72F1B8'
    }

    // Formatear y mostrar todos los argumentos
    const formattedArgs = args.map(formatValue).join(' ')
    message.textContent = formattedArgs

    consoleMessages.appendChild(message)
    consoleMessages.scrollTop = consoleMessages.scrollHeight

    // debug
    // originalConsole[type](...args)
  }

  // Sobrescribir los métodos de la consola
  console.log = (...args) => appendToConsole('log', ...args)
  console.error = (...args) => appendToConsole('error', ...args)
  console.warn = (...args) => appendToConsole('warn', ...args)
  console.info = (...args) => appendToConsole('info', ...args)
}

// Recuperar el código guardado en localStorage o usar un valor por defecto
const getSavedCode = () => {
  const savedCode = localStorage.getItem(STORAGE_KEY)
  return savedCode || ''
}

// Inicializar Monaco Editor
const editor = monaco.editor.create(codeContainer, {
  value: getSavedCode(),
  language: 'javascript',
  // theme: localStorage.getItem('theme') || editorThemes.synthwave84,
  theme: editorThemes.synthwave84,
  minimap: { enabled: false },
  automaticLayout: true,
  fontSize: 20,
  tabSize: 2,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
  lineNumbersMinChars: 3,
  scrollbar: {
    verticalScrollbarSize: 0
  }
})

// Inicializar el worker de Monaco
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

// Configurar la consola
setupConsoleRedirect()

// temporizadores de ejecutado y guardado
let executeTimer = null
let saveTimer = null

const saveCode = () => {
  const code = editor.getValue()
  localStorage.setItem(STORAGE_KEY, code)
}

// ejecutar el codigo
const executeCode = () => {
  //limpiar el historial
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

// Ejecutar el código inicialmente tras cargar
setTimeout(executeCode, 500)

// esccuchar cambios en el editor para ejecutar el codigo
editor.onDidChangeModelContent(() => {
  // Limpiar el temporizador de ejecución anterior
  if (executeTimer) {
    clearTimeout(executeTimer)
  }

  executeTimer = setTimeout(executeCode, 400)

  // Limpiar el temporizador de guardado anterior
  if (saveTimer) {
    clearTimeout(saveTimer)
  }

  saveTimer = setTimeout(saveCode, 300)
})

//Guardar antes de cerrar la apliación
window.addEventListener('beforeunload', saveCode)
