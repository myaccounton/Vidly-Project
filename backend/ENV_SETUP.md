# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

- `MONGODB_URI` - Your MongoDB Atlas connection string
- `jwtPrivateKey` - Your JWT private key for authentication


## For Test Environment

When running tests, make sure to set:
- `NODE_ENV=test`
- `MONGODB_URI` - Your test database connection string
- `jwtPrivateKey` - Your JWT private key

## Security Note

**NEVER commit `.env` files to Git!** They are already in `.gitignore`.

