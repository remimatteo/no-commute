/**
 * Generate a URL-friendly slug from job title and company name
 * Example: "Senior Developer" at "Google Inc." -> "senior-developer-at-google-inc"
 */
export function generateJobSlug(title, company) {
  if (!title && !company) return 'job';

  const titlePart = title ? title.trim() : '';
  const companyPart = company ? company.trim() : '';

  // Combine title and company with "at"
  const combined = titlePart && companyPart
    ? `${titlePart} at ${companyPart}`
    : titlePart || companyPart;

  // Convert to lowercase and replace spaces/special chars with hyphens
  const slug = combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')     // Remove leading/trailing hyphens
    .replace(/-{2,}/g, '-')      // Replace multiple hyphens with single
    .substring(0, 100);          // Limit length to 100 chars

  return slug || 'job';
}

/**
 * For CommonJS compatibility (used in scraper)
 */
export function generateJobSlugCJS(title, company) {
  return generateJobSlug(title, company);
}
