const { getPool } = require('../../lib/db.cjs');

export default async function handler(req, res) {
  const pool = getPool();
  try {
    const {
      page = 1,
      limit = 2000,
      category,
      location,
      salaryListed,
      search,
      experience
    } = req.query;

    const offset = (page - 1) * limit;

    // Build dynamic WHERE clause based on filters
    const filters = [];
    const values = [];
    let paramCount = 1;

    if (category && category !== 'All') {
      filters.push(`(category = $${paramCount} OR title ILIKE $${paramCount})`);
      values.push(category);
      paramCount++;
    }

    if (location && location !== 'All') {
      filters.push(`location ILIKE $${paramCount}`);
      values.push(`%${location}%`);
      paramCount++;
    }

    if (salaryListed === 'Yes') {
      filters.push(`salary IS NOT NULL AND salary != 'Competitive'`);
    } else if (salaryListed === 'No') {
      filters.push(`salary IS NULL OR salary = 'Competitive'`);
    }

    if (experience && experience !== 'All') {
      const experienceMap = {
        'Entry Level': ['entry', 'junior', 'intern'],
        'Mid Level': ['mid', 'intermediate', 'senior'],
        'Senior Level': ['senior', 'lead', 'principal', 'expert']
      };

      const terms = experienceMap[experience].map(term => `%${term}%`);
      const termConditions = terms.map((_, index) => `LOWER(title) LIKE $${paramCount + index}`);
      
      filters.push(`(${termConditions.join(' OR ')})`);
      values.push(...terms);
      paramCount += terms.length;
    }

    if (search) {
      filters.push(`(
        LOWER(title) LIKE $${paramCount} OR 
        LOWER(company) LIKE $${paramCount} OR 
        LOWER(category) LIKE $${paramCount} OR
        LOWER(description) LIKE $${paramCount}
      )`);
      values.push(`%${search.toLowerCase()}%`);
      paramCount++;
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Count total matching jobs
    const countResult = await pool.query(`
      SELECT COUNT(*) as total FROM jobs
      ${whereClause}
    `, values);

    const totalJobs = parseInt(countResult.rows[0].total, 10);

    // Fetch paginated and filtered jobs
    const result = await pool.query(`
      SELECT * FROM jobs
      ${whereClause}
      ORDER BY
        COALESCE(featured, false) DESC,
        created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    res.status(200).json({
      jobs: result.rows,
      totalJobs,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', message: error.message });
  }
}
