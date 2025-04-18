/* eslint-disable */
import * as monaco from 'monaco-editor'

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
  }
}

function cerrarModal(id) {
  const modal = document.getElementById(id)
  if (modal) {
    modal.classList.remove('active')
  }
}

inicializarModales()

//recuperar el tema del localStorage y aplicarlo al editor

function changeEditorTheme(themeId) {
  monaco.editor.setTheme(themeId)

  const themeBackgrounds = {
    dracula: '#282A36',
    monokai: '#272822',
    synthwave84: '#262335',
    vscodeDark: '#1E1E1E',
    xcodeLight: '#FFFFFF',
    coldarkCold: '#E3E9F2'
  }

  const backgroundColor = themeBackgrounds[themeId] || '#262335'
  document.documentElement.style.setProperty('--color-background', backgroundColor)

  localStorage.setItem('theme', themeId)
}

let selectedTheme = localStorage.getItem('theme') || 'synthwave84'
const getThemes = document.querySelectorAll('.card-theme')
const applyTheme = document.getElementById('apply-theme')

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

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'synthwave84'
  changeEditorTheme(savedTheme)
})
