import bcrypt from "bcryptjs";
import { Project, ProjectTeam, Task, User, Workspace, WorkspaceMember } from "../models/index.js";

export const seedDemoData = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log("🌱 Demo data already present, skipping seed.");
      return;
    }

    console.log("🌱 Seeding demo data for SaaS Workspace...");

    const workspace = await Workspace.create({ name: "Bharat Tech Solutions" });

    const adminHash = await bcrypt.hash("Admin@1234", 12);
    const memberHash = await bcrypt.hash("Member@1234", 12);

    const admin = await User.create({
      name: "Aradhy Jain",
      email: "aradhy@bharat.dev",
      password: adminHash,
    });

    const rahul = await User.create({
      name: "Rahul Sharma",
      email: "rahul@bharat.dev",
      password: memberHash,
    });

    const priya = await User.create({
      name: "Priya Patel",
      email: "priya@bharat.dev",
      password: memberHash,
    });

    await WorkspaceMember.create([
      { workspaceId: workspace._id, userId: admin._id, role: "Admin" },
      { workspaceId: workspace._id, userId: rahul._id, role: "Member" },
      { workspaceId: workspace._id, userId: priya._id, role: "Member" },
    ]);

    const project1 = await Project.create({
      title: "Platform Redesign",
      description: "Full UI/UX overhaul of the main customer-facing platform with modern design system.",
      workspaceId: workspace._id,
      createdBy: admin._id,
    });

    const project2 = await Project.create({
      title: "API Integration Hub",
      description: "Build a unified integration layer for all third-party services and webhooks.",
      workspaceId: workspace._id,
      createdBy: admin._id,
    });

    await ProjectTeam.create([
      { projectId: project1._id, userId: admin._id },
      { projectId: project1._id, userId: rahul._id },
      { projectId: project1._id, userId: priya._id },
      { projectId: project2._id, userId: admin._id },
      { projectId: project2._id, userId: rahul._id },
    ]);

    const now = new Date();
    const inDays = (n) => new Date(now.getTime() + n * 86400000);

    await Task.create([
      {
        title: "Design system tokens",
        description: "Define color, spacing, typography, and shape tokens in Figma and export to code.",
        workspaceId: workspace._id,
        projectId: project1._id,
        assignedTo: rahul._id,
        status: "Done",
        dueDate: inDays(-3),
      },
      {
        title: "Component library",
        description: "Build reusable React components following the new design system.",
        workspaceId: workspace._id,
        projectId: project1._id,
        assignedTo: rahul._id,
        status: "In Progress",
        dueDate: inDays(5),
      },
      {
        title: "Responsive layout audit",
        description: "Audit all pages on mobile, tablet, and desktop viewports and fix breakpoints.",
        workspaceId: workspace._id,
        projectId: project1._id,
        assignedTo: priya._id,
        status: "Todo",
        dueDate: inDays(7),
      },
      {
        title: "Dark mode implementation",
        description: "Implement dark mode using Tailwind's dark: modifier across all components.",
        workspaceId: workspace._id,
        projectId: project1._id,
        assignedTo: priya._id,
        status: "Todo",
        dueDate: inDays(10),
      },
      {
        title: "OAuth2 integration",
        description: "Integrate Google OAuth2 into the authentication service.",
        workspaceId: workspace._id,
        projectId: project2._id,
        assignedTo: rahul._id,
        status: "In Progress",
        dueDate: inDays(3),
      },
    ]);

    console.log("✅ Demo seed complete!");
    console.log(`   🏢 Workspace: ${workspace.name}`);
    console.log("   👤 aradhy@bharat.dev / Admin@1234  (Admin)");
    console.log("   👤 rahul@bharat.dev  / Member@1234 (Member)");
  } catch (error) {
    console.error("⚠️  Seed failed (non-fatal):", error.message);
  }
};
