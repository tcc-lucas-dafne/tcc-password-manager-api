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
  ...(process.env.POSTGRES_HOST !== "localhost" && { ssl: { rejectUnauthorized: false }})
});

export const register = (req, res) => {
  const { email, password } = req.body;

  const text = "INSERT INTO users(email, password) VALUES($1, $2)";
  const values = [email, password];

  pool.query(text, values, (error, results) => {
    if (error) {
      if (error.code === '23505') {
        res.status(400).json({ "error": "already registered" })
        return;
      }
    }

    res.status(201).json({ "status": "success" })
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const text = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

  pool.query(text, (error, results) => {
    if (error) {
      console.error('Database query error', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }

    if (results.rowCount) {
      const result = results.rows[0];
      const tokenData = { id: result.id };

      const token = jwt.sign(tokenData, SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(400).json({ status: 'error', message: 'User not found' });
    }
  });
};

export const getUser = (req, res) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ')[1];

    const decoded = jwt.decode(token, SECRET);
    if (decoded?.id) {
      const userId = decoded.id;
  
      const text = `SELECT id, email FROM users WHERE id='${userId}'`;
      pool.query(text, (error, results) => {
        if (error) {
          throw error;
        }
    
        if (results.rowCount) {
          const result = results.rows[0];    
          res.status(200).json(result);
        } else {
          res.status(400).json({ "status": "error", "message": "not found" });
        }
      })
    } else {
      res.status(401).json({ "status": "error", "message": "invalid token" });
    }
  } catch (err) {
    res.status(400).json({ "status": "error", "message": "invalid authorization" });
  }
}