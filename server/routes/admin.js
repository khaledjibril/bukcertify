const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'buk_admin_secret'; // In production, use env var
const ADMIN_PASSWORD = 'bukadmin123'; // In production, use env var

// Middleware: check JWT
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Basic admin info
router.get('/info', requireAdmin, (req, res) => {
  res.json({ 
    message: 'BUK Admin Dashboard',
    system: 'Certificate Verification System',
    version: '1.0.0'
  });
});

module.exports = router; 