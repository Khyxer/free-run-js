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
    
    // Si hay logs, enviar el último
    const lastLog = logs[logs.length - 1];
    
    // Si no hay logs pero hay un resultado, enviarlo
    if (!lastLog && result !== undefined) {
      logs.push({
        type: 'log',
        content: typeof result === 'object' ? JSON.stringify(result) : String(result)
      });
    }
    
    // Enviar el resultado
    self.postMessage({
      success: true,
      log: logs[logs.length - 1] || { type: 'log', content: '' }
    });
  } catch (error) {
    self.postMessage({
      success: false,
      log: {
        type: 'error',
        content: error.message
      }
    });
  }
};
