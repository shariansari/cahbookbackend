# Railway.app Deployment Guide

## Step-by-Step Guide to Deploy on Railway.app

### 1. Push Your Code to GitHub

First, make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up or log in with your GitHub account

### 3. Create a New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `cadhbookbackend`
4. Railway will automatically detect it's a Node.js project

### 4. Set Environment Variables (IMPORTANT!)

This is where you need to add your environment variables. Railway doesn't read your `.env` file for security reasons.

1. Go to your project in Railway
2. Click on your service (the app)
3. Go to the **"Variables"** tab
4. Click **"+ New Variable"** and add each of these:

#### Required Variables:

```
MONGODB_URI=mongodb+srv://shariq:shariq%40123@cluster0.yg93wuq.mongodb.net/cashbook
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

**IMPORTANT**:
- Copy the values from your `.env` file
- Make sure `JWT_SECRET` is a strong random string for production
- Use your MongoDB Atlas URI (not the local Docker one)

#### Adding Variables in Railway:

**Option 1: Add one by one**
- Click "+ New Variable"
- Enter variable name (e.g., `MONGODB_URI`)
- Enter value
- Click "Add"
- Repeat for each variable

**Option 2: Add in bulk (RAW Editor)**
- Click "RAW Editor" button
- Paste all variables in this format:
```
MONGODB_URI=mongodb+srv://shariq:shariq%40123@cluster0.yg93wuq.mongodb.net/cashbook
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

### 5. Deploy

Once you've added all environment variables:
1. Railway will automatically redeploy
2. Wait for the deployment to complete (check the "Deployments" tab)
3. Your app will be available at the URL Railway provides

### 6. Get Your App URL

1. Go to the **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your app URL (e.g., `https://your-app.up.railway.app`)

### 7. Test Your Deployment

```bash
# Test the root endpoint
curl https://your-app.up.railway.app/

# Should return:
# {"success":true,"message":"Cashbook API is running"}
```

## Troubleshooting

### Error: MONGODB_URI is not defined

**Cause**: Environment variables not set in Railway dashboard

**Solution**:
1. Go to Railway dashboard → Your Project → Variables tab
2. Make sure all variables are added (see Step 4 above)
3. After adding, Railway will automatically redeploy

### MongoDB Connection Error

**Cause**: MongoDB Atlas might be blocking Railway's IP addresses

**Solution**:
1. Go to MongoDB Atlas dashboard
2. Go to Network Access
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Save

**Note**: For production, you should whitelist only Railway's IP addresses for better security.

### Application Crashes or Won't Start

**Solution**:
1. Check the **"Logs"** tab in Railway
2. Look for error messages
3. Make sure all required environment variables are set
4. Verify your `package.json` has the correct start script

### Port Issues

Railway automatically assigns a PORT. Your code should use:
```javascript
const PORT = process.env.PORT || 5000;
```

This is already configured in your `server.js`.

## Automatic Deployments

Railway automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Railway automatically deploys the new version
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Use a strong random string |
| `JWT_EXPIRE` | JWT expiration time | `7d`, `24h`, `30d` |
| `NODE_ENV` | Environment mode | `production` or `development` |
| `PORT` | Server port (Railway sets this) | `5000` (Railway overrides this) |

## Commands

### View Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Connect to Your Project Locally
```bash
railway link
railway run npm start
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Enable MongoDB Network Access Control** - Whitelist only necessary IPs
4. **Use HTTPS** - Railway provides this automatically
5. **Set NODE_ENV to production** - Disables verbose error messages

## Cost

- Railway provides a **free tier** with:
  - $5 of usage per month
  - Suitable for small projects
  - Automatic sleeping after inactivity

- Monitor your usage in the Railway dashboard

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

## Need Help?

If you encounter issues:
1. Check Railway logs in the dashboard
2. Verify all environment variables are set correctly
3. Check MongoDB Atlas network access settings
4. Review the error messages in the deployment logs
