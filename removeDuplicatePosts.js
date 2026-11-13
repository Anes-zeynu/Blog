require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./server/config/db.js");
const Post = require("./server/model/post.js");

async function removeDuplicates() {
  try {
    await connectDB();

    // Sort posts from oldest to newest
    const duplicateGroups = await Post.aggregate([
      {
        $sort: {
          createdDate: 1,
          _id: 1,
        },
      },
      {
        $group: {
          _id: {
            title: "$title",
            body: "$body",
          },
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    let idsToDelete = [];

    for (const group of duplicateGroups) {
      // Keep the oldest post; select the remaining copies
      idsToDelete.push(...group.ids.slice(1));
    }

    console.log("Duplicate groups:", duplicateGroups.length);
    console.log("Posts to delete:", idsToDelete.length);

    if (idsToDelete.length > 0) {
      const result = await Post.deleteMany({
        _id: { $in: idsToDelete },
      });

      console.log("Deleted:", result.deletedCount);
    }

    console.log("Duplicate cleanup completed.");
  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

removeDuplicates();
