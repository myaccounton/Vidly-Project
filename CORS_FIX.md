# CORS Error Fix Guide

## Problem
CORS (Cross-Origin Resource Sharing) error when frontend tries to access backend API:
- Frontend: `https://vidly-frontend-vhim.onrender.com`
- Backend: `https://vidly-backend-r69q.onrender.com`
- Error: "No 'Access-Control-Allow-Origin' header is present"

## Solution Applied

### 1. Updated CORS Configuration (`backend/startup/routes.js`)
- Configured CORS to allow all origins (`origin: true`)
- Added explicit methods and headers
- Added preflight request handler

### 2. Updated Helmet Configuration (`backend/startup/prod.js`)
- Configured Helmet to not interfere with CORS
- Set `crossOriginResourcePolicy: { policy: "cross-origin" }`

## Deployment Steps

### After making these changes:

1. **Commit and push the changes:**
   ```bash
   cd backend
   git add .
   git commit -m "Fix CORS configuration for production"
   git push origin main
   ```

2. **Redeploy Backend on Render:**
   - Go to Render dashboard
   - Find your backend service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

3. **Verify Environment Variables:**
   Make sure these are set in Render backend environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `jwtPrivateKey=your-jwt-key`
   - `CLOUDINARY_CLOUD_NAME=your-cloudinary-name`
   - `CLOUDINARY_API_KEY=your-api-key`
   - `CLOUDINARY_API_SECRET=your-api-secret`

4. **Test the API:**
   ```bash
   curl -X OPTIONS https://vidly-backend-r69q.onrender.com/api/movies \
     -H "Origin: https://vidly-frontend-vhim.onrender.com" \
     -H "Access-Control-Request-Method: GET" \
     -v
   ```

## Alternative: If Still Not Working

If CORS errors persist after redeployment:

1. **Check Render Logs:**
   - Go to Render dashboard → Backend service → Logs
   - Look for any errors or warnings

2. **Verify Backend is Running:**
   - Check if backend URL is accessible: `https://vidly-backend-r69q.onrender.com`
   - Should return: `{"message":"Welcome to Vidly API! 🎬"}`

3. **Check Frontend Environment Variable:**
   - In Render frontend environment variables, ensure:
   - `REACT_APP_API_URL=https://vidly-backend-r69q.onrender.com/api`
   - (Note: Include `/api` at the end)

4. **Temporary Test - Allow All Origins:**
   The current CORS config already allows all origins. If still not working, there might be a network/firewall issue.

## Files Changed
- `backend/startup/routes.js` - CORS configuration
- `backend/startup/prod.js` - Helmet configuration
