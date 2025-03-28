import mysql from 'mysql2/promise';
import { db } from './dbPrismaClient';

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initial database setup - create tables if they don't exist
export async function initDatabase() {
    // try {
    //     const connection = await pool.getConnection();
    //     console.log('Connected to MySQL successfully!');

    //     // Create users table if it doesn't exist
    //     await connection.query(`
    //   CREATE TABLE IF NOT EXISTS users (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     email VARCHAR(255) NOT NULL UNIQUE,
    //     password VARCHAR(255) NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    //   )
    // `);
    //     console.log('Users table initialized');

    //     connection.release();
    // } catch (error) {
    //     console.error('Error initializing database:', error);
    // }
}

// Execute a query and return the results
export async function query(sql: string, params: any[] = []) {
    try {
        // const [results] = await pool.execute(sql, params);
        const results = await db.$queryRaw`${sql}`
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Get a single user by email
export async function getUserByEmail(email: string) {
    // const users = await query(
    //     'SELECT * FROM users WHERE email = ?',
    //     [email]
    // ) as any[];

    const users = await db.users.findFirst({
        where: {
            email: email
        }
    })

    if (!users) {
        return null;
    }

    return users
}

// Create a new user
export async function createUser(name: string, email: string, hashedPassword: string) {
    // const result = await query(
    //     'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    //     [name, email, hashedPassword]
    // ) as any;

    const newUser = await db.users.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })

    return newUser.id;
}

// Initialize the database on module import
initDatabase().catch(console.error);

export default pool; 