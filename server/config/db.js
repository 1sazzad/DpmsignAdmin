const mysql = require('mysql2');
// Ensure dotenv is configured from server.js or require it here if running this file standalone
// require('dotenv').config({ path: './../.env' }); // Adjust path if necessary

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as per your needs
  queueLimit: 0
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log(`MySQL connection pool created for database '${process.env.DB_NAME}' on host '${process.env.DB_HOST}'.`);

  // Test the connection (optional, but good for immediate feedback)
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL pool:', err.message);
      if (err.code === 'ER_BAD_DB_ERROR') {
        console.error(`Database '${process.env.DB_NAME}' does not exist. Please create it.`);
      }
      // process.exit(1); // Consider if fatal error
      return;
    }
    if (connection) {
      connection.release();
      console.log('Successfully connected to MySQL pool and released connection.');
    }
  });

} catch (error) {
    console.error('Failed to create MySQL pool:', error.message);
    // process.exit(1); // Consider if fatal error
}


// Promisify for async/await usage
// Note: mysql2/promise pool already returns promises, so explicit promisify isn't always needed
// For individual connections, or if you prefer the explicit style:
// const util = require('util');
// if (pool) pool.query = util.promisify(pool.query).bind(pool);


// Export the pool directly if using mysql2/promise
// For mysql2, you can export the pool and use pool.promise().query() or pool.promise().execute() in controllers
module.exports = pool ? pool.promise() : {
    // Fallback mock if pool creation failed, to prevent app crash during dev if DB is not up
    // This allows the rest of the app to load, though DB operations will fail.
    query: async (sql, params) => {
        console.error('DB Pool not initialized. Mock query:', sql, params);
        throw new Error('Database pool is not initialized.');
    },
    execute: async (sql, params) => {
        console.error('DB Pool not initialized. Mock execute:', sql, params);
        throw new Error('Database pool is not initialized.');
    },
    getConnection: async () => {
        console.error('DB Pool not initialized. Mock getConnection.');
        throw new Error('Database pool is not initialized.');
    }
};
