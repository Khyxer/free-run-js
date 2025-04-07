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
function showConsoleMessages(logs) {
  consoleOutput.innerHTML = logs
    .map(log => `<div class="console-${log.type}">${log.content}</div>`)
    .join('')
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
    showConsoleMessage(error.message, 'error')
  }
}

// Función para ejecutar el código
function executeCode(code) {
  // Verificar sintaxis
  const syntaxError = checkSyntax(code)
  if (syntaxError) {
    showConsoleMessage(syntaxError, 'error')
    return
  }

  // Asegurarse de que el worker esté inicializado
  if (!codeWorker) {
    initWorker()
  }

  // Enviar código al worker
  codeWorker.postMessage(code)
}

// Escuchar cambios en el textarea
let timeout = null
codeTextarea.addEventListener('input', () => {
  // Verificar sintaxis inmediatamente
  const syntaxError = checkSyntax(codeTextarea.value)
  if (syntaxError) {
    showConsoleMessage(syntaxError, 'error')
  }

  // Debounce para la ejecución
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const code = codeTextarea.value.trim()
    if (code) {
      executeCode(code)
    } else {
      consoleOutput.innerHTML = ''
    }
  }, 200)
})

// Inicializar el worker
initWorker()
