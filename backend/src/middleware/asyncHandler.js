/**
 * Envolve handlers async do Express 4 para que exceções não tratadas
 * sejam passadas para o middleware de erro global via next(err).
 */
module.exports = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
