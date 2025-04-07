// Interceptar console.* methods
const originalConsole = { ...console };
const logs = [];

['log', 'error', 'warn', 'info'].forEach(method => {
  console[method] = (...args) => {
    // Formatear la salida
    const formattedArgs = args.map(arg => {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    });

    // Guardar el log
    logs.push({
      type: method,
      content: formattedArgs.join(' ')
    });

    // Llamar al método original para debugging
    originalConsole[method](...args);
  };
});

self.onmessage = function(e) {
  // Limpiar logs anteriores
  logs.length = 0;
  
  try {
    // Ejecutar el código en un contexto aislado
    const result = new Function(e.data)();
    
    // Si no hay logs pero hay un resultado, agregarlo como log
    if (logs.length === 0 && result !== undefined) {
      logs.push({
        type: 'log',
        content: typeof result === 'object' ? JSON.stringify(result) : String(result)
      });
    }
    
    // Enviar todos los logs
    self.postMessage({
      success: true,
      logs: logs
    });
  } catch (error) {
    self.postMessage({
      success: false,
      logs: [{
        type: 'error',
        content: error.message
      }]
    });
  }
};
