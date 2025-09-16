# Contributing to EduHaven

Thanks for your interest in contributing to **EduHaven** as part of **GirlScript Summer of Code (GSSoC) 2025**! We’re excited to build with you.

---

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Be respectful, helpful, and inclusive.

---

## 🧰 Getting Started

1. **Fork** this repository.
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/<your-username>/EduHaven.git
   cd EduHaven
   ```
3. **Add upstream** (so you can pull latest changes from the main repo):

   ```bash
   git remote add upstream https://github.com/EduHaven/EduHaven.git
   ```
4. **Create `.env` files** in both `Client` and `Server` using their respective `.env.example` files.
5. **Install & run** each part in separate terminals:

   ```bash
   # Terminal 1 — Backend
   cd Server
   npm install
   npm run dev
   ```

   ```bash
   # Terminal 2 — Frontend
   cd Client
   npm install
   npm run dev
   ```

> Tip: Pull upstream changes regularly to avoid conflicts:
>
> ```bash
> git checkout main
> git fetch upstream
> git merge upstream/main
> git push origin main
> ```

---

## 🧾 Working on Issues (GSSoC Rules)

* **Pick an issue** from the repo’s Issues tab that matches your skills.
* **Comment to get assigned** before you start (mandatory for GSSoC tracking).
* **Work on only one issue at a time.**
* If something is unclear, ask questions in the issue or on Discord.

---

## 🌱 Branching & Local Workflow

Always start from the latest `main`:

```bash
git checkout main
git pull upstream main
```

Create a feature/fix branch:

```bash
# choose one of these patterns
git checkout -b fix/<issue-#>-short-title
# or
git checkout -b feat/<short-title>
```

Make changes, then commit with clear messages:

```bash
git add .
# Format: Type: short explanation
git commit -m "Fix: navbar overflow on mobile"
```

Push your branch to your fork:

```bash
git push origin <your-branch>
```

---

## 🚀 Submitting a Pull Request (PR)

* **Base branch:** open your PR against **`main`**.
* **Link the issue:** include `Fixes #<issue-number>` in the PR description.
* **Describe clearly:** what changed, why, and how to test.
* **UI changes:** include **before/after screenshots** or a short clip.
* **Keep PRs small & focused:** one fix/feature per PR.

---

## 🔍 Code Review & Merging

* Maintainers will review and may request changes this is normal.
* Be responsive and keep discussions on-topic.
* Once approved, a maintainer will merge the PR.

---

## 🏷 Labels You’ll See

> These are examples of labels used in this repo. 

* `good first issue` – good for newcomers
* `bug` – something isn’t working
* `enhancement` / `feature` – new features or improvements
* `documentation` – docs-related tasks
* `duplicate` – issue/PR already exists
* `help wanted` – maintainers request extra help
* `gssoc25` – GSSoC-specific tagging
* `level 1` / `level 2` / `level 3` – difficulty/points tiers
* `On Hold` – temporarily paused
* `Priority: high` / `Priority: Low` – priority indicators
* `invalid` / `wontfix` – out of scope or won’t be addressed
* `Bountyyyyyy-Prizzeeeeeeee` – occasional bounty/prize tag

> Label names and meanings can evolve; always check the issue’s labels and description before you start.

---

## ✅ Do’s & ❌ Don’ts

### Do’s

* ✅ Wait to be **assigned** before starting work
* ✅ Keep branches & PRs **small and focused**
* ✅ Follow the **existing folder structure** and conventions
* ✅ Write **meaningful commit messages** (`Fix:`, `Add:`, `Update:`, `Remove:`)
* ✅ Add **screenshots** for UI changes
* ✅ Pull **upstream** regularly and resolve conflicts locally
* ✅ Add tests or basic checks where relevant; run the app before opening PRs

### Don’ts

* ❌ Don’t start work **without assignment** (GSSoC rule)
* ❌ Don’t take **multiple issues** at once
* ❌ Don’t open PRs with **unrelated changes** or big refactors mixed with fixes
* ❌ Don’t reformat the entire codebase or change tooling/config unless requested
* ❌ Don’t push directly to `main`
* ❌ Don’t forget to link the issue with `Fixes #<id>`

---

## 💬 Need Help?

* Check our **Wiki** for step-by-step guidance and FAQs.
* Ask in the **Discord** server (check README).
* If you’re stuck on a task, open/continue the discussion on the **Issue** itself.

---

Thank you for being part of **EduHaven** 🙌
Let’s build something awesome together!
