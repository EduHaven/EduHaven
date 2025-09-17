# 📘 Learn.md – EduHaven Contributor Guide

Welcome to **EduHaven**! This page is your go-to reference for understanding how to contribute effectively to the project, whether you're a complete beginner or an experienced developer.

> _"Every expert was once a beginner. Don’t be afraid to start small!"_

---

## 🧭 Table of Contents

- [🆕 New to Git & GitHub? Start Here](#-new-to-git--github-start-here)
- [🚀 Step-by-Step: Your First Contribution](#-step-by-step-your-first-contribution)
- [🧠 Common Git Terms Explained](#-common-git-terms-explained)
- [🛠️ Git Commands Cheat Sheet](#️-git-commands-cheat-sheet)
- [✅ Contribution Rules](#-contribution-rules)
- [📌 Pull Request Checklist](#-pull-request-checklist)
- [🐞 Creating & Reporting Issues](#-creating--reporting-issues)
- [🆘 FAQs & Help](#-faqs--help)
- [🏁 Final Tips](#-final-tips)

---

## 🆕 New to Git & GitHub? Start Here

### Prerequisites

1. Create a GitHub account: [github.com](https://github.com)
2. Install Git: [git-scm.com](https://git-scm.com)
3. Configure Git (in terminal):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 Step-by-Step: Your First Contribution

1. **Find an Issue**
   - Look for issues tagged `good first issue` or `beginner friendly`.
   - Comment _"Hi! I'd like to work on this issue. Please assign it to me."_  
   ✅ Only comment if the issue is unassigned.

2. **Fork the Repo**

```bash
# In your browser
Click the "Fork" button in the top-right of the repo
```

3. **Clone Your Fork**

```bash
git clone https://github.com/YOUR-USERNAME/EduHaven.git
cd EduHaven
```

4. **Install Dependencies and Setup**

Follow the [README.md](./README.md#installation-and-setup) setup instructions to get EduHaven running locally.

5. **Create a Branch**

```bash
git checkout -b fix-typo-homepage
```

6. **Make Your Changes**

- Use Prettier to format your code
- Test your changes before committing

7. **Commit and Push**

```bash
git add .
git commit -m "Fix: Typo in homepage heading"
git push origin fix-typo-homepage
```

8. **Create a Pull Request**

- Go to your fork on GitHub
- Click _Compare & pull request_
- Fill in details (see template below)

---

## 🧠 Common Git Terms Explained

| Term         | Meaning                                                 |
|--------------|----------------------------------------------------------|
| **Repository** | A project with its complete file history               |
| **Fork**       | Your personal copy of the project                     |
| **Clone**      | Download the project locally                          |
| **Branch**     | A separate workspace for changes                      |
| **Commit**     | A saved change to code                                |
| **Pull Request (PR)** | A request to merge your changes into the main project |

---

## 🛠️ Git Commands Cheat Sheet

```bash
# Stage and commit
git add .
git commit -m "Add: Feature description"

# Push your branch
git push origin branch-name

# Create a branch
git checkout -b new-branch

# Switch branches
git checkout main

# Update fork with latest changes
git remote add upstream https://github.com/EduHaven/EduHaven
git fetch upstream
git merge upstream/main
```

---

## ✅ Contribution Rules

- 🔹 Work on only one issue at a time
- 🔹 Wait to be **assigned** before working on an issue
- 🔹 Write **clear commit messages** (`Type: Description`)
- 🔹 Test your changes thoroughly before creating a PR
- 🔹 Be respectful and inclusive in all discussions
- 🔹 Use screenshots for UI-related PRs
- 🔹 Format your code using Prettier

---

## 📌 Pull Request Checklist

Use this PR template when submitting:

```md
## What I Changed
- [Explain what you did]

## Why It Was Needed
- [Reason behind the change]

## How to Test
1. Go to...
2. Perform...
3. You should see...

## Screenshots (if applicable)
![before](url) ![after](url)

## Checklist
- [ ] I tested my changes
- [ ] I updated documentation if needed
- [ ] I followed the code style
- [ ] I’m linking this PR to the issue

Fixes #<issue-number>
```

✅ PR Title Examples:
- `Fix: Navbar menu not opening on mobile`
- `Add: New badge system for users`
- `Update: README with better setup guide`

---

## 🐞 Creating & Reporting Issues

### Bug Report Template

```md
## Bug Description
[What’s broken?]

## Steps to Reproduce
1. Go to...
2. Click on...
3. Observe...

## Expected Behavior
[What should happen?]

## Screenshots
[Add if helpful]

## System Info
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
```

### Feature Request Template

```md
## Feature Description
[What you want to add]

## Why It's Useful
[How it helps users]

## Possible Implementation
[Ideas for how it might work]
```

---

## 🆘 FAQs & Help

| ❓ Question | ✅ Answer |
| Can I work on more than one issue? | Yes, but it's advisable to work on one at a time. |
| What if I can't complete an issue? | Leave a comment, and it will be reassigned. |
| What if my PR is rejected? | Read feedback, revise, and resubmit. |
| Can beginners contribute? | Absolutely! Start with docs or simple issues. |
| Where do I ask for help? | [EduHaven Discord](https://discord.gg/uZv6ShY345) or in GitHub issues. |

---

## 🏁 Final Tips

- 🎯 Start small: Even fixing a typo counts!
- 🧠 Learn by reading others’ code and PRs
- 🧼 Keep your branches clean and organized
- 🫱🏽‍🫲🏾 Ask for help when stuck — we’re here for you!
- 🎉 Most importantly: **Have fun while learning and building!**

---

> 💬 **Still have questions?**
> - Join our [Discord Community](https://discord.gg/uZv6ShY345)
> - Open an issue with your doubt
> - Or reach out to mentors during contribution events like GSSoC’25

---

Let’s build something amazing together at **EduHaven** ✨
