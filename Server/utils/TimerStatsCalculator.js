import mongoose from 'mongoose';
import StudySession from '../Model/StudySession.js';

export default async function calculateStats(userId, period) {
  const now = new Date();
  let startDate = new Date();
  let groupFormat;

  switch (period) {
    case 'hourly':
      startDate.setHours(now.getHours() - 24);
      groupFormat = '%Y-%m-%d-%H';
      break;
    case 'daily':
      startDate.setDate(now.getDate() - 7);
      groupFormat = '%Y-%m-%d';
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 35);
      groupFormat = '%G-%V'; // ISO week format
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 5);
      groupFormat = '%Y-%m';
      break;
    default:
      startDate = new Date(0);
  }
2
  try {
    const stats = await StudySession.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          startTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: groupFormat, date: "$startTime" }
          },
          totalHours: { 
            $sum: { $divide: [{ $ifNull: ["$duration", 0] }, 60] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return { periodData: stats.length ? stats : [] };
  } catch (error) {
    console.error("Error calculating stats:", error);
    throw new Error("Error calculating stats");
  }
}
