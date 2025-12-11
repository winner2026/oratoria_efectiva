import { Pool, neonConfig } from '@neondatabase/serverless'

neonConfig.fetchConnectionCache = true

let pool: Pool | null = null

export function getDbClient() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }

  return pool
}

export async function queryDb<T = any>(
  query: string,
  params?: any[]
): Promise<T[]> {
  const client = getDbClient()
  const result = await client.query(query, params)
  return result.rows as T[]
}
