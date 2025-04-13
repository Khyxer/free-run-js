// En tu archivo JavaScript del frontend (renderer)
const $toggleWindow = document.getElementById('toggle-window')
const $minimizeWindow = document.getElementById('minimize-window')
const $closeWindow = document.getElementById('close-window')

// Función para actualizar el icono según el estado de maximización
function updateToggleIcon(isMaximized) {
  $toggleWindow.innerHTML = isMaximized
    ? `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-minimize-icon lucide-minimize"
        >
          <path d="M8 3v3a2 2 0 0 1-2 2H3" />
          <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
          <path d="M3 16h3a2 2 0 0 1 2 2v3" />
          <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>`
    : `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-maximize-icon lucide-maximize"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>`
}

// Función para inicializar el estado
async function initWindowState() {
  const isMaximized = await window.api.isWindowMaximized()
  updateToggleIcon(isMaximized)
}

// Escuchar cambios en el estado de maximización
window.api.onWindowStateChange((isMaximized) => {
  console.log('Estado de ventana cambiado:', isMaximized ? 'Maximizada' : 'No maximizada')
  updateToggleIcon(isMaximized)
})

// Añadir eventos a los botones
if ($toggleWindow) {
  $toggleWindow.addEventListener('click', () => {
    window.api.toggleMaximizeWindow()
  })
}

if ($minimizeWindow) {
  $minimizeWindow.addEventListener('click', () => {
    window.api.minimizeWindow()
  })
}

if ($closeWindow) {
  $closeWindow.addEventListener('click', () => {
    window.api.closeWindow()
  })
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', initWindowState)
