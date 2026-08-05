import mysql from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error("Faltan DB_NAME / DB_USER / DB_PASSWORD en el entorno (.env)");
  process.exit(1);
}

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
