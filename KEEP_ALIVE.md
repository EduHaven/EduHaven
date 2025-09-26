# Preventing Render Cold Starts

## Background

The Eduhaven backend is hosted on **Render Free Tier**, which automatically puts the instance to sleep after around **50 seconds** of inactivity.  
When the instance wakes up (cold start), it causes **3–15 seconds delay** for the first user request.

## Solution

We use an external service — **[cron-job.org](https://cron-job.org/)** — to send a request to the backend every **1 minute**.  
This keeps the backend active and eliminates most cold start delays.

## Cron Job Details

- **Service:** cron-job.org
- **URL to ping:**  
  `https://eduhaven-backend.onrender.com/`
- **Frequency:** Every 1 minute
- **Method:** GET
- **Expected Response:** HTTP `200 OK`

## How to Set Up Your Own Cron Job

1. Go to [cron-job.org](https://cron-job.org/).
2. Create a free account.
3. Add a **New Cronjob**:
   - Title: `Eduhaven Keep Alive`
   - URL: `https://eduhaven-backend.onrender.com/`
   - Schedule: Every 1 minute
4. Save and activate.
5. Check the **execution history** tab to confirm requests are successful.
