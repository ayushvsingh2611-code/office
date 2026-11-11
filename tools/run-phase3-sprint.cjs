'use strict';
/**
 * Phase 3: Multi-Domain Autonomous Application Generation Test Runner
 *
 * Executes Panda Hive's 12 Straw Hat Crew agents across 3 distinct domains:
 * 1. Healthcare Management System (`workspace/healthcare-management/`)
 * 2. E-commerce Website (`workspace/ecommerce-website/`)
 * 3. Online Learning Platform (`workspace/online-learning/`)
 *
 * Strict Role Separation:
 * - Antigravity (External System Engineer): ZERO manual application code writing.
 * - Panda Hive 12 Agents: Autonomously design, build, test, and sign-off all files.
 */

const fs = require('node:fs');
const path = require('node:path');
const loadTs = require('../test/load-ts.cjs');

// Load environment variables (.env)
const envFile = path.join(process.cwd(), '.env');
if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const { orchestrateTeamSprint } = loadTs('src/main/externalAgentServer.ts');

const PROJECTS = [
  {
    id: 1,
    name: 'healthcare-management',
    title: 'Healthcare Management System',
    prompt: [
      'build Healthcare Management System with patient dashboard, doctor directory,',
      'appointment booking simulation, patient records using demo data, search and filtering,',
      'responsive UI, interactive modals, and LocalStorage persistence'
    ].join(' ')
  },
  {
    id: 2,
    name: 'ecommerce-website',
    title: 'E-commerce Website',
    prompt: [
      'build E-commerce Website with product catalog, product details modal,',
      'search and category filters, interactive shopping cart, checkout simulation,',
      'order summary, responsive UI, and LocalStorage persistence'
    ].join(' ')
  },
  {
    id: 3,
    name: 'online-learning',
    title: 'Online Learning Platform',
    prompt: [
      'build Online Learning Platform with student dashboard, course catalog,',
      'course details modal, lesson navigation, learning progress tracking,',
      'search and filtering, responsive UI, and LocalStorage persistence'
    ].join(' ')
  }
];

async function runProject(project) {
  console.log('\n========================================================================');
  console.log(`🚀 EXECUTING PROJECT ${project.id}: ${project.title}`);
  console.log(`Target Directory: workspace/${project.name}/`);
  console.log('Crew: All 12 Straw Hat Crew AI Agents');
  console.log('Role Separation: External System Engineer writes ZERO application code');
  console.log('========================================================================\n');

  const events = [];
  const mockWebContents = {
    send: (channel, data) => {
      events.push({ channel, data, ts: Date.now() });
      if (channel === 'hive:externalAgentEvent') {
        if (data.status === 'working') {
          console.log(`  ▶ [${data.agentId}] ${data.action || 'Working...'}`);
        } else if (data.status === 'blocked') {
          console.error(`  ❌ [BLOCKED: ${data.agentId}] ${data.action}`);
        }
      } else if (channel === 'hive:externalAgentMessage') {
        const preview = (data.text || '').replace(/\n+/g, ' ').slice(0, 140);
        console.log(`  💬 [${data.sender || data.agentId}]: ${preview}...`);
      }
    }
  };

  const startTime = Date.now();
  try {
    const sprintResult = await orchestrateTeamSprint(
      project.prompt,
      mockWebContents,
      project.name
    );
    const durationTotalSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n========================================================================');
    console.log(`🏁 PROJECT ${project.id} (${project.title}) FINISHED IN ${durationTotalSec}s!`);
    console.log(`Sprint Success: ${sprintResult.success}`);
    console.log(`Target:         workspace/${project.name}/`);
    console.log('========================================================================\n');

    // Read generated test report, code review, and audit trail if present
    const baseDir = path.join(process.cwd(), 'workspace', project.name);
    let testReport = '';
    let codeReview = '';
    let signoff = '';
    let auditJson = null;

    if (fs.existsSync(path.join(baseDir, 'test-report.md'))) {
      testReport = fs.readFileSync(path.join(baseDir, 'test-report.md'), 'utf8');
    }
    if (fs.existsSync(path.join(baseDir, 'code-review.md'))) {
      codeReview = fs.readFileSync(path.join(baseDir, 'code-review.md'), 'utf8');
    }
    if (fs.existsSync(path.join(baseDir, 'sprint-signoff.md'))) {
      signoff = fs.readFileSync(path.join(baseDir, 'sprint-signoff.md'), 'utf8');
    }
    if (fs.existsSync(path.join(baseDir, 'execution-audit.json'))) {
      try {
        auditJson = JSON.parse(fs.readFileSync(path.join(baseDir, 'execution-audit.json'), 'utf8'));
      } catch {}
    }

    const filesPresent = fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];

    return {
      projectId: project.id,
      title: project.title,
      projectName: project.name,
      durationTotalSec,
      sprintResult,
      filesPresent,
      auditSummary: auditJson ? auditJson.toolExecutionSummary : null,
      testReportSnippet: testReport.slice(0, 1500),
      codeReviewSnippet: codeReview.slice(0, 1000),
      signoffSnippet: signoff.slice(0, 1000)
    };
  } catch (err) {
    console.error(`\n❌ Project ${project.id} failed with error:`, err);
    return {
      projectId: project.id,
      title: project.title,
      projectName: project.name,
      success: false,
      error: err.message
    };
  }
}

async function main() {
  const arg = (process.argv[2] || 'all').toLowerCase();
  let targetProjects = PROJECTS;

  if (arg === '1' || arg === 'healthcare') {
    targetProjects = [PROJECTS[0]];
  } else if (arg === '2' || arg === 'ecommerce') {
    targetProjects = [PROJECTS[1]];
  } else if (arg === '3' || arg === 'learning') {
    targetProjects = [PROJECTS[2]];
  }

  const results = [];
  for (const proj of targetProjects) {
    const res = await runProject(proj);
    results.push(res);

    // Save running progress to tools/phase3-results.json
    fs.writeFileSync(
      path.join(process.cwd(), 'tools', 'phase3-results.json'),
      JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2),
      'utf8'
    );
  }

  console.log('\n========================================================================');
  console.log('🏆 PHASE 3 EXECUTION BATCH COMPLETE!');
  console.log(`Executed: ${results.length} projects`);
  for (const r of results) {
    console.log(` - Project ${r.projectId} (${r.title}): files=${r.filesPresent?.length || 0}`);
  }
  console.log('Results saved to tools/phase3-results.json');
  console.log('========================================================================\n');
}

main().catch((err) => {
  console.error('Fatal batch crash:', err);
  process.exit(1);
});

