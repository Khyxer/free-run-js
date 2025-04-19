/* eslint-disable */
// Importar la instancia del editor exportada del archivo principal
import editorInstance from './renderer.js'

function inicializarModales() {
  // Botones que abren modales
  const botonesAbrir = document.querySelectorAll('[data-modal-target]')
  botonesAbrir.forEach((boton) => {
    boton.addEventListener('click', () => {
      const modalId = boton.getAttribute('data-modal-target')
      abrirModal(modalId)
    })
  })

  // Botones que cierran modales
  const botonesCerrar = document.querySelectorAll('[data-close-modal]')
  botonesCerrar.forEach((boton) => {
    boton.addEventListener('click', () => {
      const modal = boton.closest('.modal-overlay')
      cerrarModal(modal.id)
    })
  })

  // Cerrar modal al hacer clic fuera del contenido
  const modales = document.querySelectorAll('.modal-overlay')
  modales.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal(modal.id)
      }
    })
  })

  // Cerrar modal con la tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modalAbierto = document.querySelector('.modal-overlay.active')
      if (modalAbierto) {
        cerrarModal(modalAbierto.id)
      }
    }
  })
}

function abrirModal(id) {
  const modal = document.getElementById(id)
  if (modal) {
    modal.classList.add('active')

    // Si es el modal de configuración, carga los ajustes actuales
    if (id === 'modal-config') {
      loadSettingsToUI()
    }
  }
}

function cerrarModal(id) {
  const modal = document.getElementById(id)
  if (modal) {
    modal.classList.remove('active')
  }
}

// =============== Gestión de temas ===============
const THEME_BACKGROUNDS = {
  dracula: '#282A36',
  monokai: '#272822',
  synthwave84: '#262335',
  vscodeDark: '#1E1E1E',
  xcodeLight: '#FFFFFF',
  coldarkCold: '#E3E9F2'
}

const DEFAULT_THEME = 'synthwave84'

function changeEditorTheme(themeId) {
  // Usar el módulo monaco a través de editorInstance
  // Esto accede a monaco a través del editor
  const monaco = editorInstance.getModel().getLanguageId ? window.monaco : null

  if (monaco) {
    monaco.editor.setTheme(themeId)
  } else {
    // Alternativa si no podemos acceder a monaco directamente
    editorInstance._themeService.setTheme(themeId)
  }

  const backgroundColor = THEME_BACKGROUNDS[themeId] || THEME_BACKGROUNDS[DEFAULT_THEME]
  document.documentElement.style.setProperty('--color-background', backgroundColor)

  localStorage.setItem('theme', themeId)
}

function initializeThemeSelector() {
  let selectedTheme = localStorage.getItem('theme') || DEFAULT_THEME
  const getThemes = document.querySelectorAll('.card-theme')
  const applyTheme = document.getElementById('apply-theme')

  // Marca el tema guardado como seleccionado
  getThemes.forEach((theme) => {
    if (selectedTheme === theme.id) {
      theme.classList.add('selected')
    }

    theme.addEventListener('click', () => {
      selectedTheme = theme.id
      getThemes.forEach((t) => {
        t.classList.remove('selected')
      })
      theme.classList.add('selected')
    })
  })

  applyTheme.addEventListener('click', () => {
    changeEditorTheme(selectedTheme)
    cerrarModal('modal-themes')
  })
}

// =============== Gestión de configuración del editor ===============
// Valores predeterminados de configuración
const DEFAULT_SETTINGS = {
  fontSize: 20,
  tabSize: 2,
  lineNumbers: true,
  wrap: true,
  miniMap: false
}

// Referencias a elementos DOM
const configElements = {
  inputFontSize: document.getElementById('font-size-input'),
  fontSizePreview: document.getElementById('font-size-preview'),
  inputTabSize: document.getElementById('tab-size-input'),
  tabSizePreview: document.getElementById('tab-size-preview'),
  lineInput: document.getElementById('line-input'),
  wrapInput: document.getElementById('wrap-input'),
  miniMapInput: document.getElementById('minimap-input'),
  applySettings: document.getElementById('apply-settings'),
  restoreSettings: document.getElementById('restore-settings')
}

// Cargar configuraciones al UI
function loadSettingsToUI() {
  // Obtener configuración guardada o usar valores predeterminados
  const settings = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS

  // Actualizar UI con los valores
  configElements.inputFontSize.value = settings.fontSize
  configElements.inputTabSize.value = settings.tabSize
  configElements.lineInput.checked = settings.lineNumbers
  configElements.wrapInput.checked = settings.wrap
  configElements.miniMapInput.checked = settings.miniMap

  // Actualizar texto de vista previa
  updateSettingsPreview()
}

function updateSettingsPreview() {
  configElements.fontSizePreview.textContent = `Font Size: ${configElements.inputFontSize.value}px`
  configElements.tabSizePreview.textContent = `Tab Size: ${configElements.inputTabSize.value}`
}

function applyEditorSettings(settings) {
  // Usar directamente la instancia exportada del editor
  editorInstance.updateOptions({
    fontSize: settings.fontSize,
    tabSize: settings.tabSize,
    wordWrap: settings.wrap ? 'on' : 'off',
    lineNumbers: settings.lineNumbers ? 'on' : 'off',
    minimap: { enabled: settings.miniMap }
  })
}

function saveSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings))
}

function getCurrentSettingsFromUI() {
  return {
    fontSize: parseInt(configElements.inputFontSize.value, 10),
    tabSize: parseInt(configElements.inputTabSize.value, 10),
    wrap: configElements.wrapInput.checked,
    lineNumbers: configElements.lineInput.checked,
    miniMap: configElements.miniMapInput.checked
  }
}

function initializeSettingsHandlers() {
  // Actualizar previsualización cuando cambia el valor
  configElements.inputFontSize.addEventListener('input', updateSettingsPreview)
  configElements.inputTabSize.addEventListener('input', updateSettingsPreview)

  // Botón Aplicar
  configElements.applySettings.addEventListener('click', () => {
    const newSettings = getCurrentSettingsFromUI()

    // Aplicar al editor
    applyEditorSettings(newSettings)

    // Guardar en localStorage
    saveSettings(newSettings)

    cerrarModal('modal-config')
  })

  // Botón Restaurar
  configElements.restoreSettings.addEventListener('click', () => {
    // Actualizar UI con valores predeterminados
    configElements.inputFontSize.value = DEFAULT_SETTINGS.fontSize
    configElements.inputTabSize.value = DEFAULT_SETTINGS.tabSize
    configElements.lineInput.checked = DEFAULT_SETTINGS.lineNumbers
    configElements.wrapInput.checked = DEFAULT_SETTINGS.wrap
    configElements.miniMapInput.checked = DEFAULT_SETTINGS.miniMap

    updateSettingsPreview()

    // Aplicar al editor
    applyEditorSettings(DEFAULT_SETTINGS)

    // Guardar en localStorage
    saveSettings(DEFAULT_SETTINGS)

    cerrarModal('modal-config')
  })
}

// =============== Inicialización ===============
function initializeApp() {
  // Inicializar modales
  inicializarModales()

  // Inicializar selector de tema
  initializeThemeSelector()

  // Inicializar manejadores de configuración
  initializeSettingsHandlers()

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme') || DEFAULT_THEME
  changeEditorTheme(savedTheme)

  // Cargar configuración guardada y aplicarla al editor
  const savedSettings = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS
  applyEditorSettings(savedSettings)
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp)
