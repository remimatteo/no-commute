import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importSubscribers() {
  try {
    console.log('📧 Starting CSV subscriber import...\n');

    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'No commute emails - Sheet1.csv');
    console.log(`📂 Reading CSV from: ${csvPath}`);

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    // Skip header row and filter valid emails
    const emails = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',');
      const email = parts[0]?.trim();

      // Validate email
      if (email && email.includes('@') && email.includes('.')) {
        emails.push(email.toLowerCase());
      }
    }

    console.log(`✅ Found ${emails.length} valid email addresses in CSV\n`);

    if (emails.length === 0) {
      console.log('⚠️  No valid emails found. Exiting.');
      await pool.end();
      return;
    }

    // Import each email
    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    for (const email of emails) {
      try {
        // Try to insert, ignore if already exists
        const result = await pool.query(`
          INSERT INTO newsletter_subscribers (email, is_active, subscribed_at)
          VALUES ($1, true, NOW())
          ON CONFLICT (email) DO NOTHING
          RETURNING email
        `, [email]);

        if (result.rowCount > 0) {
          console.log(`✅ Imported: ${email}`);
          imported++;
        } else {
          console.log(`⏭️  Already exists: ${email}`);
          duplicates++;
        }
      } catch (error) {
        console.error(`❌ Error importing ${email}:`, error.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Newly imported: ${imported}`);
    console.log(`⏭️  Already existed: ${duplicates}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📧 Total active subscribers: ${imported + duplicates}`);
    console.log('='.repeat(50));

    // Verify total count in database
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true'
    );
    console.log(`\n✅ Database now has ${countResult.rows[0].count} active subscribers\n`);

    await pool.end();
    console.log('✨ Import complete! You can now run: node scripts/send-weekly-newsletter.js');

  } catch (error) {
    console.error('❌ Error during import:', error);
    await pool.end();
    process.exit(1);
  }
}

importSubscribers();
