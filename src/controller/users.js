const Pool = require('pg').Pool
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const register = (req, res) => {
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

const login = (req, res) => {
  const { email, password } = req.body;
  
  const text = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

  pool.query(text, (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rowCount) {
      const result = results.rows[0];
      const tokenData = { id: result.id };

      const token = jwt.sign(tokenData, SECRET, { expiresIn: '1h' });
      res.status(200).json({ token })
    } else {
      res.status(400).json({ "status": "error", "message": "not found" })
    }
  })
};

module.exports = {
  login, 
  register
}