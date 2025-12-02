import { makeAdmin, createOrUpdateUser, initializeDB } from "../src/db/index.js";

async function createQuickAdmin() {
  try {
    console.log("🔧 Creating Admin User...\n");
    
    // Initialize database
    await initializeDB();
    
    const userId = "admin123";
    const fullName = "Admin User";
    const email = "admin@example.com";
    const phone = "9999999999";
    
    // Create user
    await createOrUpdateUser(userId, {
      fullName,
      email,
      phone,
    });
    
    // Make admin
    await makeAdmin(userId);
    
    console.log("✅ Admin user created successfully!\n");
    console.log("Admin Credentials:");
    console.log(`  User ID: ${userId}`);
    console.log(`  Name: ${fullName}`);
    console.log(`  Email: ${email}`);
    console.log(`  Phone: ${phone}\n`);
    console.log("You can now use this User ID in admin API calls!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

createQuickAdmin();


