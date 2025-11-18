module.exports = (req, res, next) => {
  const user = req.usuario;
  if (!user) return res.status(401).json({ mensaje: 'No autorizado' });
  const byFlag = user.es_admin === true;
  const byEmail = process.env.ADMIN_EMAIL && user.email && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
  if (!byFlag && !byEmail) {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
};