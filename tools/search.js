/**
 * tools/search.js
 *
 * Example tool: Search
 * Replace this with a real search implementation (API call, database query, etc.)
 *
 * Every tool file should export a single async function that:
 *   - Accepts a structured input object
 *   - Returns a structured output object
 *   - Throws descriptive errors on failure
 */

/**
 * Search tool — finds information based on a query.
 *
 * @param {Object} input - Search input
 * @param {string} input.query - The search query
 * @returns {Object} Search results
 */
export async function searchTool(input) {
  const { query } = input;

  if (!query || typeof query !== 'string') {
    throw new Error('Search query must be a non-empty string');
  }

  // TODO: Replace with actual search logic (API call, vector DB, etc.)
  return {
    query,
    results: [
      {
        title: `Result for: ${query}`,
        snippet: 'This is a placeholder result. Connect to a real data source.',
        relevance: 0.95,
      },
    ],
    totalResults: 1,
  };
}
