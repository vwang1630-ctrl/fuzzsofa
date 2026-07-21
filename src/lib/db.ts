import mysql from 'mysql2/promise';

// MySQL connection pool
let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '124.221.15.233',
      port: parseInt(process.env.MYSQL_PORT || '3311'),
      user: process.env.MYSQL_USER || 'fuzzsofa',
      password: process.env.MYSQL_PASSWORD || 'WjqCrvxZ@8',
      database: process.env.MYSQL_DATABASE || 'fuzzsofa',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
}

// Convenience query function
export async function query<T = mysql.RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const [rows] = await getDbPool().execute(sql, params as Parameters<mysql.Pool['execute']>[1]);
  return rows as T;
}

// Get single row
export async function queryOne<T = mysql.RowDataPacket>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<mysql.RowDataPacket[]>(sql, params);
  return (rows[0] as T) || null;
}

// Get insert ID
export async function executeInsert(
  sql: string,
  params?: unknown[]
): Promise<{ insertId: number; affectedRows: number }> {
  const [result] = await getDbPool().execute<mysql.ResultSetHeader>(sql, params as Parameters<mysql.Pool['execute']>[1]);
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

// Execute update/delete
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<{ affectedRows: number }> {
  const [result] = await getDbPool().execute<mysql.ResultSetHeader>(sql, params as Parameters<mysql.Pool['execute']>[1]);
  return { affectedRows: result.affectedRows };
}
