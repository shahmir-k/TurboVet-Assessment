# Environment Setup

Create a `.env` file in the root of the `org` directory with the following content:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=turbovet.db

# API Configuration
API_PORT=3000

# For PostgreSQL (optional)
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=turbovet
```

**Note:** Make sure to add `.env` to your `.gitignore` file to keep secrets secure.

