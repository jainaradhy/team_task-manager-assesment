import mongoose from "mongoose";

const projectTeamSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectTeamSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectTeam = mongoose.model("ProjectTeam", projectTeamSchema);
