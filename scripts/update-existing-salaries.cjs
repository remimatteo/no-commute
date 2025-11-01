const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false
});

// Helper: Extract salary from job description text
function extractSalaryFromText(text) {
  if (!text) return null;

  // Pattern 1: "$83,300—$147,000 USD" or "$83,300-$147,000 USD"
  const pattern1 = /\$[\d,]+\s*[—\-–]\s*\$[\d,]+\s*USD/i;
  const match1 = text.match(pattern1);
  if (match1) {
    return match1[0].replace(/\s+/g, ' ').trim();
  }

  // Pattern 2: "Salary Range: $83,300—$147,000" or similar
  const pattern2 = /(salary|compensation|pay)\s*(?:range)?:?\s*\$[\d,]+\s*[—\-–]\s*\$[\d,]+/i;
  const match2 = text.match(pattern2);
  if (match2) {
    const salaryPart = match2[0].match(/\$[\d,]+\s*[—\-–]\s*\$[\d,]+/);
    if (salaryPart) {
      return salaryPart[0].replace(/\s+/g, ' ').trim();
    }
  }

  // Pattern 3: "$83,300 - $147,000" (with spaces and dash)
  const pattern3 = /\$[\d,]+\s*-\s*\$[\d,]+/;
  const match3 = text.match(pattern3);
  if (match3) {
    return match3[0].replace(/\s+/g, ' ').trim();
  }

  return null;
}

async function updateExistingSalaries() {
  console.log('💰 Updating salaries for existing jobs...\n');

  try {
    // Get all jobs with 'Competitive' salary that have descriptions
    const result = await pool.query(
      "SELECT id, title, company, description, salary FROM jobs WHERE salary = 'Competitive' AND description IS NOT NULL AND description != ''"
    );

    const jobs = result.rows;
    console.log(`📊 Found ${jobs.length} jobs with 'Competitive' salary to analyze\n`);

    let updated = 0;
    let noSalaryFound = 0;

    for (const job of jobs) {
      const extractedSalary = extractSalaryFromText(job.description);

      if (extractedSalary) {
        // Update the job with extracted salary
        await pool.query(
          'UPDATE jobs SET salary = $1 WHERE id = $2',
          [extractedSalary, job.id]
        );

        updated++;
        console.log(`✅ [${updated}] ${job.company} - ${job.title.substring(0, 50)}`);
        console.log(`   Salary: ${extractedSalary}\n`);
      } else {
        noSalaryFound++;
      }

      // Progress indicator every 100 jobs
      if ((updated + noSalaryFound) % 100 === 0) {
        console.log(`⏳ Processed ${updated + noSalaryFound}/${jobs.length} jobs...`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Updated: ${updated} jobs with extracted salaries`);
    console.log(`❌ No salary found: ${noSalaryFound} jobs`);
    console.log(`📊 Total processed: ${jobs.length} jobs`);

  } catch (error) {
    console.error('❌ Error updating salaries:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

updateExistingSalaries()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
