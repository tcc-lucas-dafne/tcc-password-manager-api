import pkg from 'pg';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv'
config();

const SECRET = process.env.SECRET;

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ...(process.env.POSTGRES_HOST !== "localhost" && { ssl: { rejectUnauthorized: false } })
});

export const getCredentials = (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(' ')[1];

  const decoded = jwt.decode(token, SECRET);

  if (decoded.id && Number.parseFloat(decoded.id)) {
    const text = `SELECT * FROM credentials WHERE user_id = ${decoded.id}`;

    pool.query(text, (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows)
    })
  } else {
    res.status(401).json({ "status": "error", "message": "invalid token" });
  }
};

export const saveCredential = (req, res) => {
  const { id, name, username, url, email, password } = req.body;

  const text = "INSERT INTO credentials(user_id, name, username, url, email, password) VALUES($1, $2, $3, $4, $5, $6)";
  const values = [id, name, username, url, email, password];

  pool.query(text, values, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(201).json(results.rows)
  })
}

export const deleteCredential = (req, res) => {
  const { id } = req.params;

  const text = `DELETE FROM credentials WHERE id = ${id}`;

  pool.query(text, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(201).json({ "status": "success", "message": "deleted" });
  })
}