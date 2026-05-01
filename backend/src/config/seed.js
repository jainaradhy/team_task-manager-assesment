import bcrypt from "bcryptjs";
import { prisma } from "./db.js";

export const seedDemoData = async () => {
  try {
    const count = await prisma.user.count();
    if (count > 0) {
      console.log("🌱 Demo data already present, skipping seed.");
      return;
    }

    console.log("🌱 Seeding demo data for SaaS Workspace...");

    // Create a demo workspace
    const workspace = await prisma.workspace.create({
      data: { name: "Acme Corporation" }
    });

    const adminHash = await bcrypt.hash("Admin@1234", 12);
    const memberHash = await bcrypt.hash("Member@1234", 12);

    const admin = await prisma.user.create({
      data: {
        name: "Alex Admin",
        email: "admin@acme.dev",
        password: adminHash,
        workspaces: {
          create: { workspaceId: workspace.id, role: "Admin" }
        }
      }
    });

    const alice = await prisma.user.create({
      data: {
        name: "Alice Dev",
        email: "alice@acme.dev",
        password: memberHash,
        workspaces: {
          create: { workspaceId: workspace.id, role: "Member" }
        }
      }
    });

    const bob = await prisma.user.create({
      data: {
        name: "Bob Designer",
        email: "bob@acme.dev",
        password: memberHash,
        workspaces: {
          create: { workspaceId: workspace.id, role: "Member" }
        }
      }
    });

    const project1 = await prisma.project.create({
      data: {
        title: "Platform Redesign",
        description: "Full UI/UX overhaul of the main customer-facing platform with modern design system.",
        workspaceId: workspace.id,
        createdBy: admin.id,
        teamMembers: {
          create: [{ userId: admin.id }, { userId: alice.id }, { userId: bob.id }]
        }
      }
    });

    const project2 = await prisma.project.create({
      data: {
        title: "API Integration Hub",
        description: "Build a unified integration layer for all third-party services and webhooks.",
        workspaceId: workspace.id,
        createdBy: admin.id,
        teamMembers: {
          create: [{ userId: admin.id }, { userId: alice.id }]
        }
      }
    });

    const now = new Date();
    const inDays = (n) => new Date(now.getTime() + n * 86400000);

    await prisma.task.createMany({
      data: [
        {
          title: "Design system tokens",
          description: "Define color, spacing, typography, and shape tokens in Figma and export to code.",
          workspaceId: workspace.id,
          projectId: project1.id,
          assignedTo: alice.id,
          status: "Done",
          dueDate: inDays(-3),
        },
        {
          title: "Component library",
          description: "Build reusable React components following the new design system.",
          workspaceId: workspace.id,
          projectId: project1.id,
          assignedTo: alice.id,
          status: "In Progress",
          dueDate: inDays(5),
        },
        {
          title: "Responsive layout audit",
          description: "Audit all pages on mobile, tablet, and desktop viewports and fix breakpoints.",
          workspaceId: workspace.id,
          projectId: project1.id,
          assignedTo: bob.id,
          status: "Todo",
          dueDate: inDays(7),
        },
        {
          title: "Dark mode implementation",
          description: "Implement dark mode using Tailwind's dark: modifier across all components.",
          workspaceId: workspace.id,
          projectId: project1.id,
          assignedTo: bob.id,
          status: "Todo",
          dueDate: inDays(10),
        },
        {
          title: "OAuth2 integration",
          description: "Integrate Google OAuth2 into the authentication service.",
          workspaceId: workspace.id,
          projectId: project2.id,
          assignedTo: alice.id,
          status: "In Progress",
          dueDate: inDays(3),
        },
      ]
    });

    console.log("✅ Demo seed complete!");
    console.log(`   🏢 Workspace: ${workspace.name}`);
    console.log("   👤 admin@acme.dev  / Admin@1234  (Admin)");
    console.log("   👤 alice@acme.dev  / Member@1234 (Member)");
  } catch (error) {
    console.error("⚠️  Seed failed (non-fatal):", error.message);
  }
};
