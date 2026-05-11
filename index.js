/**
 * test-agent — Agent Skill
 *
 * A full autonomous agent with tool-calling, planning, and execution.
 * This template provides the scaffolding for building an agent that:
 *   - Receives a goal/task from the user
 *   - Plans a sequence of steps
 *   - Executes steps using available tools
 *   - Returns a structured result
 *
 * Getting started:
 *   1. Add your tools in the tools/ directory
 *   2. Register them in the TOOLS map below
 *   3. Edit the planning logic in `planSteps()`
 *   4. Test: node index.js
 *   5. Publish: spm push
 */

import { searchTool } from './tools/search.js';

// ── Tool Registry ──────────────────────────────────────────────────────

/**
 * Registry of available tools the agent can invoke.
 * Each tool is a function: (input) => Promise<output>
 *
 * To add a new tool:
 *   1. Create a file in tools/ (e.g., tools/my-tool.js)
 *   2. Export a function with the signature: async function(input) => output
 *   3. Import and register it here
 */
const TOOLS = {
  search: searchTool,
};

// ── Agent Core ─────────────────────────────────────────────────────────

/**
 * Plans the execution steps for a given task.
 * Replace this with LLM-based planning in production.
 *
 * @param {string} task - The user's goal/task description
 * @returns {Array} Ordered list of steps to execute
 */
function planSteps(task) {
  // TODO: Replace with LLM-based planning
  return [
    { tool: 'search', input: { query: task } },
  ];
}

/**
 * Executes a single step using the specified tool.
 *
 * @param {Object} step - Step definition { tool, input }
 * @returns {Object} Step result
 */
async function executeStep(step) {
  const tool = TOOLS[step.tool];
  if (!tool) {
    return {
      success: false,
      error: `Unknown tool: ${step.tool}. Available: ${Object.keys(TOOLS).join(', ')}`,
    };
  }

  try {
    const result = await tool(step.input);
    return { success: true, tool: step.tool, result };
  } catch (error) {
    return {
      success: false,
      tool: step.tool,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Main agent function. Receives a task, plans, executes, and returns results.
 *
 * @param {Object} input - Agent input
 * @param {string} input.task - The goal/task description
 * @param {number} [input.maxSteps=10] - Maximum steps to execute (safety limit)
 * @returns {Object} Agent execution result
 */
export async function run(input) {
  const { task, maxSteps = 10 } = input;

  if (!task || typeof task !== 'string') {
    return {
      success: false,
      error: 'Input "task" must be a non-empty string',
    };
  }

  // Plan
  const steps = planSteps(task).slice(0, maxSteps);

  // Execute
  const results = [];
  for (const step of steps) {
    const result = await executeStep(step);
    results.push(result);

    // Stop on failure (unless you want resilient execution)
    if (!result.success) break;
  }

  return {
    success: results.every((r) => r.success),
    task,
    stepsExecuted: results.length,
    stepsPlanned: steps.length,
    results,
    timestamp: new Date().toISOString(),
  };
}

// ── Local Testing ──────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🤖 Running test-agent agent locally...\n');

  run({ task: 'Find information about AI skills', maxSteps: 5 })
    .then((result) => {
      console.log('✅ Agent Result:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}
