import { makeAdmin, createOrUpdateUser } from "../src/db/index.js";
import { initializeDB } from "../src/db/index.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdminUser() {
  try {
    console.log("🔧 Creating Admin User for Bus Booking System\n");
    
    // Initialize database
    await initializeDB();
    
    const userId = await question("Enter Admin User ID: ");
    
    if (!userId || userId.trim() === "") {
      console.log("❌ User ID cannot be empty");
      rl.close();
      process.exit(1);
    }
    
    const fullName = await question("Enter Full Name (optional): ");
    const email = await question("Enter Email (optional): ");
    const phone = await question("Enter Phone (optional): ");
    
    // Create or update user
    await createOrUpdateUser(userId.trim(), {
      fullName: fullName.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
    });
    
    // Make admin
    const success = await makeAdmin(userId.trim());
    
    if (success) {
      console.log("\n✅ Admin user created successfully!");
      console.log(`\nAdmin Details:`);
      console.log(`- User ID: ${userId.trim()}`);
      console.log(`- Full Name: ${fullName.trim() || 'Not provided'}`);
      console.log(`- Email: ${email.trim() || 'Not provided'}`);
      console.log(`- Phone: ${phone.trim() || 'Not provided'}`);
      console.log(`\nYou can now access admin panel with this User ID`);
    } else {
      console.log("❌ Failed to create admin user");
    }
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    rl.close();
    process.exit(1);
  }
}

createAdminUser();


