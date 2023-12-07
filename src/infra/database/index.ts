import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT as string) || 5432,
  host: process.env.DB_HOST
});

pool.on('error', (err) => {
  console.error('[DATABASE]> Error on connection: ', err.message);
});

export {
  pool
};