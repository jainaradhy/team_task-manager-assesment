# 🎥 Demo Video Script (3 Minutes)

This script is designed to impress recruiters by highlighting the UI quality, multi-tenant architecture, and core functionality rapidly.

---

### [0:00 - 0:15] Introduction & Login
*(Screen shows the Login page)*
**"Hi, this is my Team Task Manager application. It's built with React, Node.js, and a Prisma-managed SQL database. Let me log in as the Workspace Admin for Acme Corporation."**
*(Log in using `admin@acme.dev` / `Admin@1234`)*

### [0:15 - 0:45] The Dashboard
*(Screen transitions to Dashboard)*
**"As soon as I log in, I see the real-time Dashboard. This is the control center for my entire workspace. We have high-level metric cards showing pending vs. completed tasks, a breakdown of tasks specifically assigned to me, and an activity log on the right that tracks actions taken by my team members across the company."**

### [0:45 - 1:15] Creating a Project
*(Click on "Projects" in the sidebar)*
**"Let's create a new project. Because I have the Admin role, I have permission to provision new projects and assign team members."**
*(Click 'Create Project', fill in 'Marketing Campaign', and select Alice and Bob from the dropdown. Click Save.)*
**"The project is instantly created, and Alice and Bob now have secure access to view it."**

### [1:15 - 2:00] Task Management & Kanban Board
*(Click on "Task Board" in the sidebar)*
**"Here is the core of the app: The Kanban Board. It features a modern, clean UI with color-coded priority badges—Red for High, Yellow for Medium."**
*(Click 'New Task')*
**"I'm going to quickly create a High Priority task and assign it to Alice."**
*(Fill out task details, set Priority to High, Assign to Alice, and hit Save. The task appears in 'Todo'.)*

### [2:00 - 2:30] Drag and Drop & Filtering
*(Drag the newly created task into 'In Progress')*
**"As an Admin, I can seamlessly drag and drop tasks across columns. I've also built advanced filtering and sorting. For example, if I only want to see High priority tasks sorted by Due Date, I can use these dropdowns here."**
*(Demonstrate the priority filter dropdown)*

### [2:30 - 3:00] Conclusion
*(Log out, briefly show the Signup page)*
**"Finally, the app supports full multi-tenancy. If a new user comes to the Signup page, they don't just create an account—they provision a completely isolated Workspace for their own company. 
The frontend is deployed on Vercel, the backend is on Railway, and the codebase is completely production-ready. Thank you for your time!"**
