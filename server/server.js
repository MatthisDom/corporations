import express from 'express';
import { db, initDB } from './db.js';

await initDB();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/api/users', async (req, res) => {
  await db.read();
  res.json(db.data.users || []);
});

app.post('/api/register', async (req, res) => {
  await db.read();
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  if (db.data.users.some(u => u.username === username)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  db.data.users.push({ username, password });
  await db.write();
  res.status(201).json({ message: 'User registered' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

export { app };