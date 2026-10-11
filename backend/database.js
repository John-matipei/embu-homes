const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'embu_homes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Landlords table with password tracking
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS landlords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        name VARCHAR(255),
        is_default_account BOOLEAN DEFAULT FALSE,
        password_changed BOOLEAN DEFAULT FALSE,
        login_attempts INT DEFAULT 0,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);
    
    // Security logs table for tracking hackers
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        landlord_id INT,
        action VARCHAR(100) NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        success BOOLEAN,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (landlord_id) REFERENCES landlords(id) ON DELETE SET NULL
      )
    `);
    
    // Houses table (replace in-memory storage)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS houses (
        id VARCHAR(100) PRIMARY KEY,
        landlord_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        estate VARCHAR(100),
        type VARCHAR(50),
        rent INT,
        deposit INT,
        distance VARCHAR(50),
        status ENUM('Vacant', 'Occupied') DEFAULT 'Vacant',
        rooms INT DEFAULT 1,
        bathrooms INT DEFAULT 1,
        water VARCHAR(50),
        electricity VARCHAR(50),
        furnished BOOLEAN DEFAULT FALSE,
        description TEXT,
        phone VARCHAR(50),
        image LONGTEXT,
        amenities JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (landlord_id) REFERENCES landlords(id) ON DELETE CASCADE
      )
    `);
    
    // Bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(100) PRIMARY KEY,
        house_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50) NOT NULL,
        preferred_date DATE NOT NULL,
        preferred_time VARCHAR(50),
        message TEXT,
        student_id VARCHAR(100),
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = { pool, initDatabase };