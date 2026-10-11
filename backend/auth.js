const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

// Create default landlord account
async function createDefaultLandlord() {
  try {
    const defaultEmail = 'landlord@embu.com';
    const defaultPassword = 'Embu123!';
    
    // Check if default exists
    const [existing] = await pool.execute(
      'SELECT id FROM landlords WHERE email = ?',
      [defaultEmail]
    );
    
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
      
      await pool.execute(
        `INSERT INTO landlords (email, password_hash, name, is_default_account, password_changed) 
         VALUES (?, ?, ?, TRUE, FALSE)`,
        [defaultEmail, hashedPassword, 'Default Landlord']
      );
      
      console.log('Default landlord created:', defaultEmail);
    }
  } catch (error) {
    console.error('Failed to create default landlord:', error);
  }
}

// Create new landlord (YOU create accounts for clients)
async function createLandlord(name, email, password, phone = null) {
  const [existing] = await pool.execute(
    'SELECT id FROM landlords WHERE email = ?',
    [email]
  );
  
  if (existing.length > 0) {
    throw new Error('Email already registered');
  }
  
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  const [result] = await pool.execute(
    `INSERT INTO landlords (email, password_hash, name, phone, password_changed, is_default_account) 
     VALUES (?, ?, ?, ?, TRUE, FALSE)`,
    [email, hashedPassword, name, phone]
  );
  
  return { 
    id: result.insertId, 
    name, 
    email, 
    phone,
    password
  };
}

// Register new landlord (for admin use)
async function registerLandlord(email, password, name, phone) {
  return await createLandlord(name, email, password, phone);
}

// Login landlord
async function loginLandlord(email, password, ipAddress, userAgent) {
  console.log(`Login attempt from ${ipAddress} for ${email}`);
  
  const [landlords] = await pool.execute(
    'SELECT * FROM landlords WHERE email = ?',
    [email]
  );
  
  if (landlords.length === 0) {
    await logSecurityEvent(null, 'LOGIN_FAILED', ipAddress, userAgent, false, 'Email not found');
    throw new Error('Invalid credentials');
  }
  
  const landlord = landlords[0];
  
  const isValid = await bcrypt.compare(password, landlord.password_hash);
  
  if (!isValid) {
    await pool.execute(
      'UPDATE landlords SET login_attempts = login_attempts + 1 WHERE id = ?',
      [landlord.id]
    );
    
    await logSecurityEvent(landlord.id, 'LOGIN_FAILED', ipAddress, userAgent, false, 'Wrong password');
    throw new Error('Invalid credentials');
  }
  
  await pool.execute(
    'UPDATE landlords SET login_attempts = 0, last_login = NOW(), ip_address = ?, user_agent = ? WHERE id = ?',
    [ipAddress, userAgent, landlord.id]
  );
  
  await logSecurityEvent(landlord.id, 'LOGIN_SUCCESS', ipAddress, userAgent, true, 'Login successful');
  
  const token = jwt.sign(
    { 
      landlordId: landlord.id, 
      email: landlord.email,
      isDefault: landlord.is_default_account
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    token,
    landlord: {
      id: landlord.id,
      email: landlord.email,
      name: landlord.name,
      phone: landlord.phone
    }
  };
}

// Change password (optional)
async function changePassword(landlordId, newPassword, ipAddress, userAgent) {
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  await pool.execute(
    `UPDATE landlords 
     SET password_hash = ?, password_changed = TRUE, updated_at = NOW() 
     WHERE id = ?`,
    [hashedPassword, landlordId]
  );
  
  await logSecurityEvent(landlordId, 'PASSWORD_CHANGED', ipAddress, userAgent, true, 'Password changed successfully');
  
  return true;
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Log security events
async function logSecurityEvent(landlordId, action, ipAddress, userAgent, success, details) {
  try {
    await pool.execute(
      `INSERT INTO security_logs (landlord_id, action, ip_address, user_agent, success, details) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [landlordId, action, ipAddress, userAgent, success, details]
    );
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Get security logs
async function getSecurityLogs(landlordId = null, limit = 100) {
  let query = `
    SELECT sl.*, l.email, l.name 
    FROM security_logs sl 
    LEFT JOIN landlords l ON sl.landlord_id = l.id 
    ORDER BY sl.created_at DESC 
    LIMIT ?
  `;
  let params = [limit];
  
  if (landlordId) {
    query = `
      SELECT sl.*, l.email, l.name 
      FROM security_logs sl 
      LEFT JOIN landlords l ON sl.landlord_id = l.id 
      WHERE sl.landlord_id = ? 
      ORDER BY sl.created_at DESC 
      LIMIT ?
    `;
    params = [landlordId, limit];
  }
  
  const [logs] = await pool.execute(query, params);
  return logs;
}

// Get all landlords
async function getAllLandlords() {
  const [landlords] = await pool.execute(`
    SELECT id, email, name, phone, is_default_account, password_changed, 
           login_attempts, last_login, created_at, ip_address 
    FROM landlords 
    ORDER BY created_at DESC
  `);
  return landlords;
}

module.exports = {
  createDefaultLandlord,
  createLandlord,
  registerLandlord,
  loginLandlord,
  changePassword,
  verifyToken,
  getSecurityLogs,
  getAllLandlords,
  logSecurityEvent,
  JWT_SECRET
};