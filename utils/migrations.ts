import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import pool from './db';

interface Migration {
    id: number;
    name: string;
    executed_at: Date;
}

// Create migrations table if it doesn't exist
async function initMigrationsTable() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        connection.release();
    }
}

// Get list of executed migrations
async function getExecutedMigrations(): Promise<string[]> {
    const [rows] = await pool.query('SELECT name FROM migrations ORDER BY id ASC') as any;
    return rows.map((row: Migration) => row.name);
}

// Run a single migration
async function runMigration(filename: string, sql: string) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Execute the migration
        await connection.query(sql);

        // Record the migration
        await connection.query(
            'INSERT INTO migrations (name) VALUES (?)',
            [filename]
        );

        await connection.commit();
        console.log(`✅ Executed migration: ${filename}`);
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Main migration function
export async function migrate() {
    try {
        // Initialize migrations table
        await initMigrationsTable();

        // Get executed migrations
        const executedMigrations = await getExecutedMigrations();

        // Read migration files
        const migrationsDir = path.join(process.cwd(), 'migrations');
        const files = await fs.readdir(migrationsDir);

        // Filter SQL files and sort them
        const pendingMigrations = files
            .filter(f => f.endsWith('.sql'))
            .filter(f => !executedMigrations.includes(f))
            .sort();

        // Run pending migrations
        for (const file of pendingMigrations) {
            const filePath = path.join(migrationsDir, file);
            const sql = await fs.readFile(filePath, 'utf8');
            await runMigration(file, sql);
        }

        if (pendingMigrations.length === 0) {
            console.log('No pending migrations.');
        } else {
            console.log(`Executed ${pendingMigrations.length} migrations.`);
        }
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    migrate().then(() => process.exit(0));
} 