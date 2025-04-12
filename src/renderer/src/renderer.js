import Split from 'split.js'
import * as monaco from 'monaco-editor'
import { editorThemes } from './themes.js'

// Inicializar Split.js para el panel dividido
Split(['#split-0', '#split-1'], {
  gutterSize: 20
})

// Obtener referencias a los elementos
const codeContainer = document.getElementById('code')
// const consoleOutput = document.getElementById('console')

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

// Inicializar Monaco Editor
monaco.editor.create(codeContainer, {
  value: '',
  language: 'javascript',
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

// // Función para mostrar mensajes en la consola
// function showConsoleMessage(message, type = 'log') {
//   const div = document.createElement('div')
//   div.className = `console-${type}`
//   div.textContent = message
//   consoleOutput.appendChild(div)
// }

// // Función para mostrar mensajes en la consola (múltiples)
// function showConsoleMessages(logs) {
//   consoleOutput.innerHTML = ''
//   logs.forEach((log) => {
//     const div = document.createElement('div')
//     div.className = `console-${log.type}`
//     div.textContent = log.content
//     consoleOutput.appendChild(div)
//   })
// }

// // Función para verificar la sintaxis del código
// function checkSyntax(code) {
//   try {
//     new Function(code)
//     return null
//   } catch (error) {
//     return error.message
//   }
// }

// // Función para inicializar el worker
// function initWorker() {
//   // Terminar el worker anterior si existe
//   if (codeWorker) {
//     codeWorker.terminate()
//   }

//   // Crear nuevo worker
//   codeWorker = new Worker(new URL('./code-worker.js', import.meta.url))

//   // Manejar mensajes del worker
//   codeWorker.onmessage = (e) => {
//     const { success, logs } = e.data
//     if (logs && logs.length > 0) {
//       showConsoleMessages(logs)
//     } else {
//       consoleOutput.innerHTML = ''
//     }
//   }

//   // Manejar errores del worker
//   codeWorker.onerror = (error) => {
//     showConsoleMessage(`Worker error: ${error.message}`, 'error')
//   }
// }

// // Función para ejecutar el código
// function executeCode(code) {
//   // Limpiar la consola antes de ejecutar
//   consoleOutput.innerHTML = ''

//   // Verificar sintaxis
//   const syntaxError = checkSyntax(code)
//   if (syntaxError) {
//     showConsoleMessage(`Syntax Error: ${syntaxError}`, 'error')
//     return
//   }

//   // Asegurarse de que el worker esté inicializado
//   if (!codeWorker) {
//     initWorker()
//   }

//   try {
//     // Enviar código al worker
//     codeWorker.postMessage(code)
//   } catch (error) {
//     showConsoleMessage(`Error sending to worker: ${error.message}`, 'error')
//   }
// }

// Escuchar cambios en el editor
// let timeout = null
// editor.onDidChangeModelContent(() => {
//   // Debounce para la ejecución
//   clearTimeout(timeout)
//   timeout = setTimeout(() => {
//     const code = editor.getValue().trim()
//     if (code) {
//       executeCode(code)
//     } else {
//       consoleOutput.innerHTML = ''
//     }
//   }, 300)
// })

// // Ejecutar al iniciar para procesar cualquier código predeterminado
// window.addEventListener('DOMContentLoaded', () => {
//   initWorker()
//   const initialCode = editor.getValue().trim()
//   if (initialCode) {
//     executeCode(initialCode)
//   }
// })
