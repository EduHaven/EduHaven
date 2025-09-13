[![join our group on discord](./Client/public/joinDiscordIcon.png)
](https://discord.gg/CbsNFUDC)

<p align="center">
  <b>This project is now OFFICIALLY accepted for:</b>
</p>

<div align="center">
  <img src="Client/public/gssoc.png" alt="GSSOC" width="50%">
</div>

# Eduhaven

![image](https://github.com/user-attachments/assets/970c84bf-ac78-4583-af73-d2b8b4b393b0)

## Overview

**EduHaven** is a platform designed to assist students by providing a productivity-focused environment. It aims to provide a space where students can Learn and grow together by socialising with friends. It incorporates real-time collaboration, task management, analytics, AI-chatbot, note-making, gamification and more.

## Features

- #### User Dashboard (home page)
  - Study & break timer for focus, see your stats summary
  - Add and manage notes
  - Set your goals, set repeat / deadline etc.
  - Integrated calendars for event planning
  - The tools like AI chat, calculator, convertor and graph to help with studies

- #### Real-Time Study Rooms

  - Join or create study rooms to study with your fiends
  - Video/audio controls
  - Control who can join your study room
  - Chat and discussion features.

- #### See Realtime  stats:
  - View Stats of your study time
  - View your streaks, max streak
  - See your rank globally and also within your friends
  - Earn badges show-off to your friends.
  - See the analytics of friends.
  - See your goals completion rate.

- #### Realtime Chat
  - Chat in Realtime with peers. share notes and study materials
  - Private messaging
  - Online/offline presence indicators

- #### Friends and Social Features
  - Add friends, invite them to study rooms
  - Track their online/offline status
  - Share study goals and progress

- #### Gamification
  - Earn badges and rewards for task completion
  - Track streaks to stay motivated
  - Leaderboards for friendly competition
  - Also an additional games page, to refresh your mind

## Tech Stack

- **Frontend**: React.js, Tailwind, Zustand, Tansack-query
- **Backend**: Node.js with Express
- **Database**: MongoDB, Cloudinary
- **Real-Time Communication**: Socket.IO, WebRTC

## Installation and Setup
- Make sure you've joined our [discord server](https://discord.gg/CbsNFUDC) so you can connect in case you face any issues.
- **Prerequisites:** Node.js, MongoDB, Git

### Steps to Run Locally

1. After forking the repository, Clone the forked repository:

   ```bash
   git clone https://github.com/<your-username>/EduHaven.git
   cd EduHaven

   ```

2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd Server
   npm install

   # Install frontend dependencies
   cd ../Client
   npm install
   ```

3. Set up environment variables:

   - **for frontend:**

     - create a `.env` file in the `/Client` directory, and copy all the contents from `.env.example`.

   - **for backend:**

     - Create a `.env` file in the `/Server` directory.
     - Follow the instructions provided in `.env.example` file to create a new `.env` file for backend.

    🔴 **make sure the contents of `.env.example` file must remain untouched.**


4. Start the development servers:

   ```bash
   # Start backend server
   cd Server
   npm run dev

   # Start frontend server
   cd ../Client
   npm run dev
   ```

## Contribution Guidelines

1. You must get assigned to the issue before you start working on it. leave comment to get issue assigned.
2. Code must be properly formatted. (use preetier configuration provided)
3. Commits should generally be minimal
4. The body of the commit message should explain why and how the change was made.It should provide clear context for all changes mage that will help both a reviewer now, and a developer looking at your changes a year later, understand the motivation behind your decisions.

We welcome contributions to make **EduHaven** better for students everywhere! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature/bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and test them thoroughly.

- For frontend changes, also run:
  ```bash
  npm run build
  ```
  and verify there are no build errors.

4. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add a brief description of your changes"
   git push origin feature-name
   ```
5. Before pushing frontend changes, **run** `npm run build` locally to ensure the project builds successfully. Catch & solve any potential deployment issues early, if any.
6. Create a Pull Request (PR) with a detailed explanation of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to contributors for their efforts in building **EduHaven**.
- Inspired by productivity tools and online collaborative platforms.

---

## Preventing Backend Cold Starts

The backend is hosted on Render Free Tier and may go to sleep after short inactivity.  
We;re keeping it alive using [cron-job.org](https://cron-job.org/) to ping the backend every 1 minute.
For full details, see [`KEEP_ALIVE.md`](KEEP_ALIVE.md).
- Backend URL: https://eduhaven-backend.onrender.com/

For any further queries, feel free to reach out on our [Discord](https://discord.gg/CbsNFUDC) group. Let’s make learning fun and productive!
