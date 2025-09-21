# Database Migration System

A simple yet powerful database migration system for Node.js applications using PostgreSQL. This system provides automatic migration management with TypeScript support.

## Features

- Automatic migration execution on server startup
- Migration file generation with templates
- Migration status tracking
- Rollback support (extensible)
- Transaction-based migration execution
- CLI-based migration management
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd learn-migrate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Or use individual variables:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=your_database
```

## Project Structure

```
src/
├── app.ts                 # Main application file
├── migrate.ts            # Migration CLI script
├── config/
│   └── database.ts       # Database configuration
├── utils/
│   └── migrator.ts       # Migration utility class
└── migrations/           # Migration files (auto-created)
    ├── 001_create_users_table.sql
    ├── 002_add_email_index.sql
    └── ...
```

## Usage

### Starting the Server

The server will automatically run pending migrations on startup:

```bash
npm run dev
```

### Migration Commands

#### Generate a New Migration

```bash
# Generate migration with descriptive name
npm run migrate generate "create users table"
npm run migrate g "add email index"
```

This creates a new migration file in the `src/migrations/` directory with the following template:

```sql
-- Migration: create users table
-- Created at: 2024-01-20

-- Write your migration SQL here
-- Example:
-- CREATE TABLE example_table (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
```

#### Run All Pending Migrations

```bash
npm run migrate up
# or
npm run migrate:up
```

#### Check Migration Status

```bash
npm run migrate status
npm run migrate s
# or
npm run migrate:status
```

Output example:
```
Migration Status:
==================
Executed 001_create_users_table.sql
Executed 002_add_email_index.sql
Pending  003_create_posts_table.sql

Total: 3 migrations, 1 pending
```

#### Rollback Migrations

```bash
# Rollback last migration
npm run migrate rollback

# Rollback specific migration
npm run migrate rollback 003_create_posts_table.sql
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run migrate` | Show migration commands help |
| `npm run migrate:generate` | Generate new migration file |
| `npm run migrate:up` | Run all pending migrations |
| `npm run migrate:status` | Show migration status |
| `npm run migrate:rollback` | Rollback migrations |

## Migration File Naming Convention

Migration files follow this naming pattern:
```
{number}_{description}.sql
```

Examples:
- `001_create_users_table.sql`
- `002_add_email_index.sql`
- `003_create_posts_table.sql`

## Example Migration Files

### Create Users Table
```sql
-- Migration: create users table
-- Created at: 2024-01-20

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Add Posts Table
```sql
-- Migration: create posts table
-- Created at: 2024-01-21

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
```

## Database Schema

The migration system automatically creates a `migrations` table to track executed migrations:

```sql
CREATE TABLE migrations (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

- **Transaction Safety**: Each migration runs within a database transaction
- **Rollback on Error**: If a migration fails, the transaction is rolled back
- **Error Logging**: Detailed error messages help debug migration issues
- **Server Startup**: Server won't start if migrations fail

## API Example

The system includes example routes showing how to use the database:

```typescript
// GET /users - Fetch all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});
```

## Development Workflow

1. **Create Migration**: `npm run migrate generate "description"`
2. **Edit Migration**: Add your SQL in the generated file
3. **Run Migration**: `npm run migrate up`
4. **Check Status**: `npm run migrate status`
5. **Test**: Start your server and test the changes

## Best Practices

### Migration Writing
- Always use transactions for complex operations
- Include rollback SQL in comments for manual rollbacks
- Test migrations on a copy of production data
- Keep migrations focused on a single change
- Use descriptive names for migrations

### Example with Rollback Comments
```sql
-- Migration: add user roles
-- Rollback: DROP COLUMN role FROM users;

ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
UPDATE users SET role = 'user' WHERE role IS NULL;
```

## Troubleshooting

### Common Issues

**Migration fails to execute:**
```bash
# Check database connection
npm run migrate status
```

**Migration directory not found:**
The system automatically creates the `src/migrations/` directory when needed.

**Duplicate migration names:**
Migration numbering is automatic and sequential to prevent conflicts.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the ISC License - see the package.json file for details.

## TODO / Future Enhancements

- Implement complete rollback functionality
- Add migration dependency management
- Support for seed data
- Migration history with timestamps
- Backup before migrations
- Support for multiple databases
- GUI for migration management

## Support

If you encounter any issues or have questions, please create an issue in this repository.