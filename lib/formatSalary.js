/**
 * Format salary strings to ensure proper capitalization
 * - Converts "usd" to "USD"
 * - Converts "k" to "K"
 * - Handles various formats like "$80k-100k usd" -> "$80K-100K USD"
 */
export function formatSalary(salary) {
  if (!salary || typeof salary !== 'string') {
    return salary;
  }

  let formatted = salary;

  // Replace all variations of "usd" with "USD" (case-insensitive)
  formatted = formatted.replace(/\busd\b/gi, 'USD');

  // Replace "k" with "K" when it follows a number (case-insensitive)
  formatted = formatted.replace(/(\d)k\b/gi, '$1K');

  return formatted;
}
