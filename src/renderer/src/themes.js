/* eslint-disable */
import * as monaco from 'monaco-editor'

// Exportamos un objeto con los nombres de los temas disponibles
export const editorThemes = {
  dracula: 'dracula',
  monokai: 'monokai',
  synthwave84: 'synthwave84'
  // Puedes agregar más temas aquí
}

// Definimos el tema Dracula
monaco.editor.defineTheme(editorThemes.dracula, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272A4' },
    { token: 'string', foreground: 'F1FA8C' },
    { token: 'keyword', foreground: 'FF79C6' },
    { token: 'number', foreground: 'BD93F9' },
    { token: 'operator', foreground: 'FF79C6' },
    { token: 'function', foreground: '50FA7B' }
  ],
  colors: {
    'editor.background': '#282A36',
    'editor.foreground': '#F8F8F2',
    'editor.lineHighlightBackground': '#44475A',
    'editor.selectionBackground': '#44475A',
    'editor.inactiveSelectionBackground': '#44475A70'
  }
})

// Definimos el tema Monokai
monaco.editor.defineTheme(editorThemes.monokai, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '88846F' },
    { token: 'string', foreground: 'E6DB74' },
    { token: 'keyword', foreground: 'F92672' },
    { token: 'number', foreground: 'AE81FF' },
    { token: 'operator', foreground: 'F92672' },
    { token: 'function', foreground: 'A6E22E' }
  ],
  colors: {
    'editor.background': '#272822',
    'editor.foreground': '#F8F8F2',
    'editor.lineHighlightBackground': '#3E3D32',
    'editor.selectionBackground': '#49483E',
    'editor.inactiveSelectionBackground': '#49483E70'
  }
})

// Definimos el tema Synthwave '84
monaco.editor.defineTheme(editorThemes.synthwave84, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6D7A99', fontStyle: 'italic' },
    { token: 'string', foreground: 'FF9D00' },
    { token: 'keyword', foreground: 'F92AFF' },
    { token: 'number', foreground: '72F1B8' },
    { token: 'operator', foreground: 'F92AFF' },
    { token: 'function', foreground: '36F9F6' },
    { token: 'variable', foreground: 'FFFFFF' },
    { token: 'type', foreground: 'FE4450' },
    { token: 'class', foreground: '72F1B8', fontStyle: 'bold' },
    { token: 'constant', foreground: '72F1B8' },
    { token: 'parameter', foreground: 'FFFFFF' },
    { token: 'property', foreground: 'FFFFFF' },
    { token: 'delimiter', foreground: 'FFFFFF' },
    { token: 'tag', foreground: 'FE4450' },
    { token: 'attribute.name', foreground: '72F1B8' },
    { token: 'attribute.value', foreground: 'FF9D00' }
  ],
  colors: {
    'editor.background': '#262335',
    'editor.foreground': '#FFFFFF',
    'editor.lineHighlightBackground': '#2A2139',
    'editor.selectionBackground': '#34294F',
    'editor.inactiveSelectionBackground': '#34294F80',
    'editorCursor.foreground': '#F92AFF',
    'editorLineNumber.foreground': '#495495',
    'editorLineNumber.activeForeground': '#FE4450',
    'editorIndentGuide.background': '#34294F80',
    'editorIndentGuide.activeBackground': '#6D7A9980',
    'editorSuggestWidget.background': '#241B2F',
    'editorSuggestWidget.border': '#34294F',
    'editorSuggestWidget.selectedBackground': '#34294F',
    'editorHoverWidget.background': '#241B2F',
    'editorHoverWidget.border': '#34294F',
    'editorWidget.background': '#241B2F',
    'editorWidget.border': '#34294F'
  }
})