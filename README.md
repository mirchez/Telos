
# Telos

Telos is an AI-powered platform that allows you to quickly and easily create applications and websites. With Telos, you can generate complete projects like Netflix clones, Kanban boards, admin dashboards, and much more, all with just a few clicks and simple commands.

## 🚀 Demo

Access the online version here: [https://telos-steel.vercel.app/](https://telos-steel.vercel.app/)

## ✨ Features

- Automatic generation of web applications using AI.
- Predefined templates for popular projects (Netflix, Kanban, Dashboard, etc.).
- Intuitive and modern interface.
- User authentication.
- File explorer and code viewer.
- Project system and message management.
- Integration with TRPC and Prisma for an efficient backend.
- Easy deployment on Vercel.

## 🛠️ Technologies Used

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **TRPC** (API)
- **React** (UI Components)
- **Tailwind CSS** (Styles)
- **PostgreSQL** (Database)
- **Vercel** (Deployment)
- **E2B** (Sandbox for generated project compilation)
- **Inngest** (Workflow automation)

## 📦 Local Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd telos
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example` (if it exists) and add your database credentials and required keys.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. Go to [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Project Structure

- `/src/app`: Main pages and routes (Next.js App Router)
- `/src/components`: Reusable UI components
- `/src/modules`: Business logic by domain (projects, messages, home, etc.)
- `/src/lib`: Utilities and helpers
- `/prisma`: Database schema and migrations
- `/sandbox-templates`: Templates for generated project sandboxes

## 📝 Usage

1. Log in to the platform.
2. Choose a template or describe the project you want to create.
3. The AI will automatically generate the code and project structure.
4. Explore, edit, and download your project from the interface.

## 📄 License

This project is licensed under the MIT License.

---

Questions or suggestions? Contribute or open an issue!

---
