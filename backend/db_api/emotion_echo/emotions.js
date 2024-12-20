const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

//loading env variables
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  const SECRET_KEY = 'thisISAKey6546156';


  //api for getting emotion
  const getEmotions = async (req, res) => {
    const { token, date, month } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }

        try {
            let result;

            if (month) {
                // Parse the month to get year and month parts
                const [year, monthPart] = month.split('-');
                result = await pool.query(
                    'SELECT * FROM emotions WHERE DATE_PART(\'year\', date) = $1 AND DATE_PART(\'month\', date) = $2',
                    [year, monthPart]
                );
            } else if (date) {
                result = await pool.query('SELECT * FROM emotions WHERE date = $1', [date]);
            } else {
                result = await pool.query('SELECT * FROM emotions');
            }

            res.json({
                success: true,
                emotions: result.rows,
            });
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
        }
    });
};




  module.exports = { getEmotions };