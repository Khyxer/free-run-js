import Split from 'split.js'
import * as monaco from 'monaco-editor'

// Inicializar Split.js para el panel dividido
Split(['#split-0', '#split-1'], {
  gutterSize: 20
})

// Configurar el tema Dracula para Monaco Editor
monaco.editor.defineTheme('dracula', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272A4' },
    { token: 'string', foreground: 'F1FA8C' },
    { token: 'keyword', foreground: 'FF79C6' },
    { token: 'number', foreground: 'BD93F9' },
    { token: 'operator', foreground: 'FF79C6' },
    { token: 'function', foreground: '50FA7B' },
  ],
  colors: {
    'editor.background': '#282A36',
    'editor.foreground': '#F8F8F2',
    'editor.lineHighlightBackground': '#44475A',
    'editor.selectionBackground': '#44475A',
    'editor.inactiveSelectionBackground': '#44475A70',
  }
})

// Obtener referencias a los elementos
const codeContainer = document.getElementById('code')
const consoleOutput = document.getElementById('console')

// Crear el Web Worker
let codeWorker = null

// Inicializar Monaco Editor
const editor = monaco.editor.create(codeContainer, {
  value: '',
  language: 'javascript',
  theme: 'dracula',
  minimap: { enabled: false },
  automaticLayout: true,
  fontSize: 14,
  tabSize: 2,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on',
})

// Función para mostrar mensajes en la consola
function showConsoleMessage(message, type = 'log') {
  const div = document.createElement('div')
  div.className = `console-${type}`
  div.textContent = message
  consoleOutput.appendChild(div)
}

// Función para mostrar mensajes en la consola (múltiples)
function showConsoleMessages(logs) {
  consoleOutput.innerHTML = ''
  logs.forEach(log => {
    const div = document.createElement('div')
    div.className = `console-${log.type}`
    div.textContent = log.content
    consoleOutput.appendChild(div)
  })
}

// Función para verificar la sintaxis del código
function checkSyntax(code) {
  try {
    new Function(code)
    return null
  } catch (error) {
    return error.message
  }
}

// Función para inicializar el worker
function initWorker() {
  // Terminar el worker anterior si existe
  if (codeWorker) {
    codeWorker.terminate()
  }

  // Crear nuevo worker
  codeWorker = new Worker(new URL('./code-worker.js', import.meta.url))

  // Manejar mensajes del worker
  codeWorker.onmessage = (e) => {
    const { success, logs } = e.data
    if (logs && logs.length > 0) {
      showConsoleMessages(logs)
    } else {
      consoleOutput.innerHTML = ''
    }
  }

  // Manejar errores del worker
  codeWorker.onerror = (error) => {
    showConsoleMessage(`Worker error: ${error.message}`, 'error')
  }
}

// Función para ejecutar el código
function executeCode(code) {
  // Limpiar la consola antes de ejecutar
  consoleOutput.innerHTML = ''
  
  // Verificar sintaxis
  const syntaxError = checkSyntax(code)
  if (syntaxError) {
    showConsoleMessage(`Syntax Error: ${syntaxError}`, 'error')
    return
  }

  // Asegurarse de que el worker esté inicializado
  if (!codeWorker) {
    initWorker()
  }

  try {
    // Enviar código al worker
    codeWorker.postMessage(code)
  } catch (error) {
    showConsoleMessage(`Error sending to worker: ${error.message}`, 'error')
  }
}

// Escuchar cambios en el editor
let timeout = null
editor.onDidChangeModelContent(() => {
  // Debounce para la ejecución
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const code = editor.getValue().trim()
    if (code) {
      executeCode(code)
    } else {
      consoleOutput.innerHTML = ''
    }
  }, 300)
})

// Ejecutar al iniciar para procesar cualquier código predeterminado
window.addEventListener('DOMContentLoaded', () => {
  initWorker()
  const initialCode = editor.getValue().trim()
  if (initialCode) {
    executeCode(initialCode)
  }
})