/* eslint-disable */

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
