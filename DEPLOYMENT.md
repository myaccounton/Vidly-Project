# Deployment Guide for Render

This guide will help you deploy your Vidly application (backend + frontend) to Render.

## Prerequisites

1. A GitHub account with your code pushed to `https://github.com/myaccounton/Project`
2. A Render account (sign up at https://render.com)
3. MongoDB Atlas connection string (already set up)

## Step 1: Deploy Backend

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your repository**:
   - Select "GitHub" and authorize Render
   - Select repository: `myaccounton/Project`
4. **Configure the service**:
   - **Name**: `vidly-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Set Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = Your MongoDB Atlas connection string (from your .env file)
   - `jwtPrivateKey` = Your JWT private key (from your .env file)
   - `PORT` = Leave empty (Render will set this automatically)
6. **Click "Create Web Service"**

Wait for the backend to deploy. Note the URL (e.g., `https://vidly-backend.onrender.com`)

## Step 2: Deploy Frontend

1. **Go to Render Dashboard** → **"New +"** → **"Static Site"**
2. **Connect your repository**:
   - Select repository: `myaccounton/Project`
3. **Configure the service**:
   - **Name**: `vidly-frontend` (or any name you prefer)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. **Set Environment Variables**:
   - `REACT_APP_API_URL` = `https://vidly-backend.onrender.com/api`
     (Replace `vidly-backend` with your actual backend service name)
5. **Click "Create Static Site"**

Wait for the frontend to deploy. You'll get a URL like `https://vidly-frontend.onrender.com`

## Step 3: Update CORS (if needed)

If you encounter CORS errors, make sure your backend allows requests from your frontend URL. The backend already has CORS enabled, but you may need to update it to allow your frontend domain.

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Test the application functionality
3. Check backend logs in Render dashboard if there are any issues

## Important Notes

- **Free tier limitations**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **Environment Variables**: Never commit `.env` files. Always set them in Render dashboard.
- **MongoDB Atlas**: Make sure your MongoDB Atlas IP whitelist includes Render's IP ranges, or set it to allow from anywhere (0.0.0.0/0) for development.

## Troubleshooting

- **Backend won't start**: Check logs in Render dashboard, verify environment variables are set correctly
- **Frontend can't connect to backend**: Verify `REACT_APP_API_URL` is set correctly and backend is running
- **CORS errors**: Check that backend CORS is configured to allow your frontend domain
