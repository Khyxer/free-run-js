/* eslint-disable */
import * as monaco from 'monaco-editor'

// Exportamos un objeto con los nombres de los temas disponibles
export const editorThemes = {
  dracula: 'dracula',
  monokai: 'monokai',
  synthwave84: 'synthwave84',
  vscodeDark: 'vscodeDark',
  xcodeLight: 'xcodeLight',
  coldarkCold: 'coldarkCold'
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

// Definimos el tema VSCode Dark
monaco.editor.defineTheme(editorThemes.vscodeDark, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'operator', foreground: 'D4D4D4' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'class', foreground: '4EC9B0' },
    { token: 'interface', foreground: '4EC9B0' },
    { token: 'enum', foreground: '4EC9B0' },
    { token: 'constant', foreground: '4FC1FF' },
    { token: 'parameter', foreground: '9CDCFE' },
    { token: 'property', foreground: '9CDCFE' },
    { token: 'delimiter', foreground: 'D4D4D4' },
    { token: 'tag', foreground: '569CD6' },
    { token: 'attribute.name', foreground: '9CDCFE' },
    { token: 'attribute.value', foreground: 'CE9178' }
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editor.lineHighlightBackground': '#2A2D2E',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#264F7880',
    'editorCursor.foreground': '#AEAFAD',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    'editorSuggestWidget.background': '#252526',
    'editorSuggestWidget.border': '#454545',
    'editorSuggestWidget.selectedBackground': '#062F4A',
    'editorHoverWidget.background': '#252526',
    'editorHoverWidget.border': '#454545',
    'editorWidget.background': '#252526',
    'editorWidget.border': '#454545'
  }
})

// Definimos el tema XCode Light
monaco.editor.defineTheme(editorThemes.xcodeLight, {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6C7986', fontStyle: 'italic' },
    { token: 'string', foreground: 'D12F1B' },
    { token: 'keyword', foreground: 'AA0D91' },
    { token: 'number', foreground: '1C00CF' },
    { token: 'operator', foreground: '000000' },
    { token: 'function', foreground: '326D74' },
    { token: 'variable', foreground: '326D74' },
    { token: 'type', foreground: '0F68A0' },
    { token: 'class', foreground: '0F68A0' },
    { token: 'interface', foreground: '0F68A0' },
    { token: 'constant', foreground: '3F6E75' },
    { token: 'parameter', foreground: '5C2699' },
    { token: 'property', foreground: '326D74' },
    { token: 'delimiter', foreground: '000000' },
    { token: 'tag', foreground: 'AA0D91' },
    { token: 'attribute.name', foreground: '326D74' },
    { token: 'attribute.value', foreground: 'D12F1B' }
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000',
    'editor.lineHighlightBackground': '#E8F2FF',
    'editor.selectionBackground': '#B5D5FF',
    'editor.inactiveSelectionBackground': '#B5D5FF80',
    'editorCursor.foreground': '#000000',
    'editorLineNumber.foreground': '#9DA2A6',
    'editorLineNumber.activeForeground': '#000000',
    'editorIndentGuide.background': '#D6D6D6',
    'editorIndentGuide.activeBackground': '#BDC2C6',
    'editorSuggestWidget.background': '#F5F5F5',
    'editorSuggestWidget.border': '#DFDFDF',
    'editorSuggestWidget.selectedBackground': '#B5D5FF',
    'editorHoverWidget.background': '#F5F5F5',
    'editorHoverWidget.border': '#DFDFDF',
    'editorWidget.background': '#F5F5F5',
    'editorWidget.border': '#DFDFDF'
  }
})

// Definimos el tema Coldark Cold
monaco.editor.defineTheme(editorThemes.coldarkCold, {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '676D81' },
    { token: 'string', foreground: '0094C2' },
    { token: 'keyword', foreground: '006D6D' },
    { token: 'number', foreground: 'A684FF' },
    { token: 'operator', foreground: '5A6171' },
    { token: 'function', foreground: '755F00' },
    { token: 'variable', foreground: '116B00' },
    { token: 'type', foreground: '006D6D' },
    { token: 'class', foreground: '0094C2' },
    { token: 'interface', foreground: '0094C2' },
    { token: 'constant', foreground: '00855F' },
    { token: 'parameter', foreground: '116B00' },
    { token: 'property', foreground: '116B00' },
    { token: 'delimiter', foreground: '111B27' },
    { token: 'tag', foreground: '006D6D' },
    { token: 'attribute.name', foreground: '755F00' },
    { token: 'attribute.value', foreground: '0094C2' }
  ],
  colors: {
    'editor.background': '#E3E9F2',
    'editor.foreground': '#111B27',
    'editor.lineHighlightBackground': '#D8DEE9',
    'editor.selectionBackground': '#8DA1BF66',
    'editor.inactiveSelectionBackground': '#8DA1BF33',
    'editorCursor.foreground': '#111B27',
    'editorLineNumber.foreground': '#8DA1BF',
    'editorLineNumber.activeForeground': '#111B27',
    'editorIndentGuide.background': '#CCD3DE',
    'editorIndentGuide.activeBackground': '#8DA1BF',
    'editorSuggestWidget.background': '#E3E9F2',
    'editorSuggestWidget.border': '#CCD3DE',
    'editorSuggestWidget.selectedBackground': '#D0D6E0',
    'editorHoverWidget.background': '#E3E9F2',
    'editorHoverWidget.border': '#CCD3DE',
    'editorWidget.background': '#E3E9F2',
    'editorWidget.border': '#CCD3DE'
  }
})
