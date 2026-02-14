# 🚀 ProKanban Elite – Smart Task Manager

A professional-grade, full-stack Kanban productivity dashboard built with **React 18**, **Vite**, **TailwindCSS**, and **Supabase**. Designed for high-performance task management with a focus on rich aesthetics and fluid user experience.

🔗 **Live Demo**: [kanban-elite.netlify.app](https://kanban-elite-task-manager.netlify.app/)

---

## ✨ Features

### 📌 Elite Task Management
- **Intelligent Kanban**: Drag & drop tasks between **To Do**, **In Progress**, and **Done** with real-time state updates.
- **Mobile Optimized**: Native-feel touch interactions with long-press drag support for mobile and tablets.
- **Smart Views**: Toggle between high-density **Board View** and a detailed **Activity Log** (List View).
- **Task Lifecycle**: Full CRUD capabilities including archiving and permanent deletion.

### 📊 Productivity Insights
- **Analytics Dashboard**: Real-time visualization of task distribution and project health.
- **Progress Tracking**: Automatic progress bars based on subtask completion.
- **Priority Matrix**: Visual indicators for Low, Medium, and High priority tasks.

### 🔐 Enterprise-Grade Security
- **Supabase Authentication**: Secure login and lightning-fast registration.
- **Row Level Security (RLS)**: Your data is isolated and protected at the database level.
- **Persistent Sessions**: Stay logged in across browser restarts.

### 🎨 Premium UI/UX
- **Dynamic Themes**: Fully responsive design with deep dark mode support.
- **Glassmorphism**: Modern frosted-glass interfaces with smooth micro-animations.
- **Customization**: Change your accent color and view density to suit your workflow.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Styling** | TailwindCSS + Lucide Icons |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Interactions** | @dnd-kit (Performance-tuned) |
| **Deployment** | Netlify + GitHub CI/CD |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/vishwasahuja62-maker/Kanban-Board.git
cd Kanban-Board
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the provided `setup_supabase.sql` script in your Supabase SQL Editor to initialize the tables and RLS policies.

### 5. Launch Development
```bash
npm run dev
```

---

## 📂 Project Structure

```text
src/
 ├── components/    # Reusable UI Blocks (TaskCard, Board, Sidebar)
 ├── context/       # State Management (Auth, Project Logic)
 ├── assets/        # Global Styles and Media
 └── main.jsx       # Entry point
public/             # Static Assets & Logo
setup_supabase.sql  # Database Schema & Security Policies
```

---

## 👨‍💻 Author

**Vishwas Ahuja**
*Full-Stack Developer | B.Tech CSE*

If you find this project helpful, please consider giving it a ⭐ on GitHub!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
