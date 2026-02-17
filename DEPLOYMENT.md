# ClaimLens Deployment Guide

ClaimLens is a full-stack application with separate frontend and backend deployments.

## Frontend Deployment (Vercel)

1. **Environment Variables**
   - Add `VITE_API_URL` pointing to your backend Render URL (e.g., `https://your-backend.render.com`)

2. **Deploy**
   ```bash
   npm run build
   ```
   Push to GitHub and connect to Vercel. The build process runs automatically.

## Backend Deployment (Render)

1. **Environment Variables**
   Set these in your Render service:
   - `NOVA_API_KEY` - Your Amazon Nova API key
   - `AGENT_1_ID` - AGENT-4d7ee428c4d14d068df3f05955cd9b3c
   - `AGENT_2_ID` - AGENT-15eef4be36e54b3ba086708f481c85af
   - `AGENT_3_ID` - AGENT-da7feeb8638e43c0a105bac0eba51ac9
   - `AGENT_4_ID` - AGENT-ba5d6fc1dc5d41348f5d8df3b998bdaa
   - `PORT` - 3001 (default)

2. **Build Command**
   ```
   npm install --prefix backend
   ```

3. **Start Command**
   ```
   npm start --prefix backend
   ```

4. **Root Directory**
   Leave as default (project root)

## Local Development

### Frontend
```bash
npm run dev
```
Runs on http://localhost:5173

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:3001

Update `VITE_API_URL` in `.env` to point to `http://localhost:3001` for local development.

## API Endpoint

**POST /api/process-claim**

Request body:
```json
{
  "claimData": {
    "name": "string",
    "policyNumber": "string",
    "incidentDate": "string (YYYY-MM-DD)",
    "city": "string",
    "state": "string",
    "country": "string",
    "category": "string",
    "description": "string",
    "estimatedValue": "string (numeric)",
    "thirdParties": "string"
  },
  "imageBase64": "string (base64 encoded image)"
}
```

Response:
```json
{
  "agent1": "string (claim intake output)",
  "agent2": "string (damage analysis output)",
  "agent3": "string (cost estimate output)",
  "agent4": "string (settlement recommendation output)"
}
```

## Troubleshooting

- **CORS errors**: Ensure backend has CORS enabled (already configured)
- **Timeout errors**: Agent processing can take 60-90 seconds; requests have 120-second timeout
- **API errors**: Check that all AGENT_IDs and NOVA_API_KEY are correct
