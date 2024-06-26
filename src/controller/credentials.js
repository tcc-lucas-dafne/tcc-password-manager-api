import pkg from 'pg';
import { config } from 'dotenv'
config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ...(process.env.POSTGRES_HOST !== "localhost" && { ssl: { rejectUnauthorized: false }})
});

export const getCredentials = (req, res) => {
  const { id } = req.params;

  if (Number.parseFloat(id)) {
    const text = `SELECT * FROM credentials WHERE user_id = $1`;
    const values = [id]

    pool.query(text, values, (error, results) => {
      if (error) {
        throw error;
      }
  
      res.status(200).json(results.rows)
    })
  } else {
    res.status(400).json({ "status": "error", "message": "invalid id" })
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

  const text = `DELETE FROM credentials WHERE id = $1`;
  const values = [id]

  pool.query(text, values, (error, results) => {
    if (error) {
      throw error;
    }

    res.status(201).json({ "status": "success", "message": "deleted" });
  })
}