'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const loadTs = require('./load-ts.cjs');

const {
  isGitRepository,
  getGitStatus,
  getGitDiff
} = loadTs('src/main/gitTools.ts');

test('GitTools: Identifies git repository and inspects status on current repo', () => {
  const currentWs = path.resolve(__dirname, '..');
  const isRepo = isGitRepository(currentWs);
  assert.strictEqual(isRepo, true, 'Current workspace should be recognized as git repo');

  const status = getGitStatus(currentWs);
  assert.strictEqual(status.isGitRepo, true);
  assert.ok(status.branch, 'Branch name should be present');
  assert.ok(Array.isArray(status.staged));
  assert.ok(Array.isArray(status.unstaged));
  assert.ok(Array.isArray(status.untracked));
});

test('GitTools: Gracefully handles non-git directory without throwing', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-non-git-'));
  try {
    const isRepo = isGitRepository(tmpDir);
    assert.strictEqual(isRepo, false);

    const status = getGitStatus(tmpDir);
    assert.strictEqual(status.isGitRepo, false);
    assert.ok(status.error && status.error.includes('not a git repository'));

    const diff = getGitDiff(tmpDir);
    assert.strictEqual(diff.isGitRepo, false);
    assert.ok(diff.error && diff.error.includes('not a git repository'));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('GitTools: Tests staged and unstaged diffs on an isolated temporary git repo', () => {
  const tmpRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'hive-temp-git-'));
  try {
    // Initialize git repo
    execFileSync('git', ['init'], { cwd: tmpRepo });
    execFileSync('git', ['config', 'user.name', 'Panda Hive Test'], { cwd: tmpRepo });
    execFileSync('git', ['config', 'user.email', 'test@pandahive.local'], { cwd: tmpRepo });

    // Create file A
    fs.writeFileSync(path.join(tmpRepo, 'file1.txt'), 'Initial content\n', 'utf8');
    execFileSync('git', ['add', 'file1.txt'], { cwd: tmpRepo });
    execFileSync('git', ['commit', '-m', 'Initial commit'], { cwd: tmpRepo });

    // Modify file A (unstaged)
    fs.writeFileSync(path.join(tmpRepo, 'file1.txt'), 'Initial content\nSecond line\n', 'utf8');

    // Create file B and stage it
    fs.writeFileSync(path.join(tmpRepo, 'file2.txt'), 'Staged new file\n', 'utf8');
    execFileSync('git', ['add', 'file2.txt'], { cwd: tmpRepo });

    // Check status
    const status = getGitStatus(tmpRepo);
    assert.strictEqual(status.isGitRepo, true);
    assert.strictEqual(status.clean, false);
    assert.ok(status.unstaged.some((s) => s.path === 'file1.txt'));
    assert.ok(status.staged.some((s) => s.path === 'file2.txt'));

    // Check unstaged diff
    const unstagedDiff = getGitDiff(tmpRepo);
    assert.strictEqual(unstagedDiff.isGitRepo, true);
    assert.ok(unstagedDiff.diff.includes('+Second line'));

    // Check staged diff
    const stagedDiff = getGitDiff(tmpRepo, { staged: true });
    assert.strictEqual(stagedDiff.isGitRepo, true);
    assert.ok(stagedDiff.diff.includes('+Staged new file'));

    // Check path-specific diff
    const file1Diff = getGitDiff(tmpRepo, { path: 'file1.txt' });
    assert.ok(file1Diff.diff.includes('+Second line'));

    // Check path traversal rejection
    assert.throws(() => {
      getGitDiff(tmpRepo, { path: '../../outside.txt' });
    }, /Permission denied/);

    // Check maxBytes truncation
    const smallDiff = getGitDiff(tmpRepo, { maxBytes: 20 });
    assert.strictEqual(smallDiff.truncated, true);
    assert.ok(smallDiff.diff.includes('truncated'));
  } finally {
    fs.rmSync(tmpRepo, { recursive: true, force: true });
  }
});
