import cron from 'node-cron';
import { checkAndResetStreaks } from './streakUpdater.js';

// Run daily at midnight (00:00)
const scheduleStreakReset = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily streak reset check...');
    try {
      await checkAndResetStreaks();
      console.log('Daily streak reset check completed');
    } catch (error) {
      console.error('Error during daily streak reset:', error);
    }
  });
  console.log('Streak reset cron job scheduled to run daily at midnight');
};

export default scheduleStreakReset;

