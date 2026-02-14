# 🚀 Kanban Board - Project Management Dashboard

A modern, responsive, and feature-rich project management tool built with React and TailwindCSS. This application provides a seamless experience for managing tasks with a beautiful UI and smooth interactions.

## ✨ Features

- **Kanban Board**: Drag-and-drop tasks between columns (ToDo, In Progress, Done). Mobile-friendly with long-press support.
- **List View**: Detailed list of tasks with sorting and filtering options.
- **Analytics**: Visualize project progress with charts and statistics.
- **Archive**: Manage completed or archived tasks.
- **Authentication**: Secure login and registration powered by **Supabase**.
- **Dark Mode**: Fully supported dark theme with a toggle.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Real-time Updates**: (If enabled via Supabase) Instant updates across clients.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Styling**: TailwindCSS, Lucide React (Icons)
- **State Management**: Context API
- **Drag & Drop**: @dnd-kit/core
- **Backend**: Supabase (Auth & Database)

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/kanban-board.git
    cd kanban-board
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    - Create a `.env` file in the root directory.
    - Add your Supabase credentials:
      ```env
      VITE_SUPABASE_URL=your_supabase_url
      VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `src/components`: UI components (BoardView, Sidebar, TaskCard, etc.)
- `src/context`: React Context providers (AuthContext, ProjectContext)
- `src/assets`: Static assets
- `public`: Public assets like favicon

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
