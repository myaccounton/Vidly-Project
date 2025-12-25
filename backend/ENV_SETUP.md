# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
jwtPrivateKey=yourSecretPrivateKey123
```

## For Test Environment

When running tests, make sure to set:
- `NODE_ENV=test`
- `MONGODB_URI` - Your test database connection string
- `jwtPrivateKey` - Your JWT private key

## Security Note

**NEVER commit `.env` files to Git!** They are already in `.gitignore`.

