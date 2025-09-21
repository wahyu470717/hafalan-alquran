import fs from 'fs';
import path from 'path';
import pool from '../config/database';

class Migrator {

  private migrationsDir = path.join(__dirname, '../database')

  async createMigrationTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations(
        id SERIAL PRIMAY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await pool.query(query)
  }

  async getExecutedMigrations() :Promise<string[]> {
    const result = await pool.query(
      'SELECT filename FROM migrations ORDER BY id'
    );

    return result.rows.map(row => row.filename);
  }

  

}
export default new Migrator();