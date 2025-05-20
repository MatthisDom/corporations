import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Correction : fournir la valeur par défaut à la création de Low
const adapter = new JSONFile('db.json')
export const db = new Low(adapter, { users: [] })

export async function initDB() {
  await db.read()
  if (!db.data) db.data = { users: [] }
  await db.write()
}

// Appel de l'init au démarrage du serveur (dans server.js)
