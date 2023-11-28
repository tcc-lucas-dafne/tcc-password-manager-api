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

const login = (req, res) => {
  const { email, password } = req.body;
  
  const text = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

  pool.query(text, (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rowCount) {
      const token = jwt.sign({ foo: 'bar' }, SECRET, { expiresIn: '1h' });
      res.status(200).json({ ...results.rows[0], token })
    } else {
      res.status(400).json({ "status": "error", "message": "not found" })
    }
  })
};

module.exports = {
  login
}