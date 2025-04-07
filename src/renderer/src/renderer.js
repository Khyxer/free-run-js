import Split from 'split.js'

// Inicializar Split.js para el panel dividido
Split(['#split-0', '#split-1'], {
  gutterSize: 20
})

// Obtener referencias a los elementos
const codeTextarea = document.getElementById('code')
const consoleOutput = document.getElementById('console')

// Crear el Web Worker
let codeWorker = null

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

// Escuchar cambios en el textarea
let timeout = null
codeTextarea.addEventListener('input', () => {
  // Debounce para la ejecución
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const code = codeTextarea.value.trim()
    if (code) {
      executeCode(code)
    } else {
      consoleOutput.innerHTML = ''
    }
  }, 300) // Aumentado ligeramente para dar más tiempo
})

// Ejecutar al iniciar para procesar cualquier código predeterminado
window.addEventListener('DOMContentLoaded', () => {
  initWorker()
  if (codeTextarea.value.trim()) {
    executeCode(codeTextarea.value.trim())
  }
})