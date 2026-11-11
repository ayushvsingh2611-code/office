/**
 * Panda Hive Native Git Tools
 *
 * Provides workspace-jailed, read-only Git status and diff inspections
 * using the local git binary, without requiring external Python/PyPI dependencies.
 */
import { execFileSync } from 'node:child_process';
import { resolve, normalize, relative } from 'node:path';
import { existsSync } from 'node:fs';

export interface GitStatusItem {
  path: string;
  status: string;
  indexStatus: string;
  workingTreeStatus: string;
}

export interface GitStatusResult {
  isGitRepo: boolean;
  branch?: string;
  tracking?: string;
  ahead?: number;
  behind?: number;
  staged: GitStatusItem[];
  unstaged: GitStatusItem[];
  untracked: string[];
  clean: boolean;
  raw?: string;
  error?: string;
}

export interface GitDiffOptions {
  staged?: boolean;
  path?: string;
  maxBytes?: number;
}

export interface GitDiffResult {
  isGitRepo: boolean;
  diff: string;
  truncated: boolean;
  totalBytes: number;
  error?: string;
}

const DEFAULT_MAX_DIFF_BYTES = 64 * 1024; // 64 KB cap

/**
 * Checks if workspace directory is inside a valid git repository.
 */
export function isGitRepository(workspaceDir: string): boolean {
  try {
    const out = execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true,
      timeout: 5000
    });
    return out.trim() === 'true';
  } catch {
    return false;
  }
}

/**
 * Inspects repository status using `git status --porcelain=v1 -b`.
 */
export function getGitStatus(workspaceDir: string): GitStatusResult {
  if (!existsSync(workspaceDir)) {
    return {
      isGitRepo: false,
      staged: [],
      unstaged: [],
      untracked: [],
      clean: true,
      error: `Workspace directory does not exist: ${workspaceDir}`
    };
  }

  try {
    const rawOutput = execFileSync('git', ['status', '--porcelain=v1', '-b'], {
      cwd: workspaceDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      timeout: 10000
    });

    const lines = rawOutput.split('\n');
    let branch: string | undefined;
    let tracking: string | undefined;
    let ahead: number | undefined;
    let behind: number | undefined;

    const staged: GitStatusItem[] = [];
    const unstaged: GitStatusItem[] = [];
    const untracked: string[] = [];

    for (const rawLine of lines) {
      if (!rawLine.trim()) continue;

      if (rawLine.startsWith('## ')) {
        // Header line: ## branch...tracking [ahead X, behind Y] or ## No commits yet on branch
        const header = rawLine.slice(3).trim();
        if (header.includes('...')) {
          const parts = header.split('...');
          branch = parts[0];
          const rest = parts[1] || '';
          const trackMatch = rest.match(/^([^\s]+)/);
          if (trackMatch) {
            tracking = trackMatch[1];
          }
          const aheadMatch = rest.match(/ahead\s+(\d+)/);
          if (aheadMatch) ahead = parseInt(aheadMatch[1], 10);
          const behindMatch = rest.match(/behind\s+(\d+)/);
          if (behindMatch) behind = parseInt(behindMatch[1], 10);
        } else if (header.startsWith('No commits yet on ')) {
          branch = header.replace('No commits yet on ', '').trim();
        } else {
          branch = header.split(' ')[0];
        }
        continue;
      }

      const x = rawLine[0];
      const y = rawLine[1];
      const filePath = rawLine.slice(3).trim();

      if (x === '?' && y === '?') {
        untracked.push(filePath);
        continue;
      }

      if (x && x !== ' ' && x !== '?') {
        staged.push({
          path: filePath,
          status: x,
          indexStatus: x,
          workingTreeStatus: y
        });
      }

      if (y && y !== ' ' && y !== '?') {
        unstaged.push({
          path: filePath,
          status: y,
          indexStatus: x,
          workingTreeStatus: y
        });
      }
    }

    const clean = staged.length === 0 && unstaged.length === 0 && untracked.length === 0;

    return {
      isGitRepo: true,
      branch,
      tracking,
      ahead,
      behind,
      staged,
      unstaged,
      untracked,
      clean,
      raw: rawOutput.slice(0, 4000)
    };
  } catch (err: any) {
    const stderr = err?.stderr?.toString() || err?.message || String(err);
    const isNotRepo = /not a git repository/i.test(stderr);
    const notFound = /ENOENT/i.test(stderr) || /command not found/i.test(stderr);

    return {
      isGitRepo: false,
      staged: [],
      unstaged: [],
      untracked: [],
      clean: true,
      error: notFound
        ? 'Git binary not found on system PATH.'
        : isNotRepo
        ? 'Directory is not a git repository.'
        : `Git status execution failed: ${stderr.trim()}`
    };
  }
}

/**
 * Computes git diff with strict path safety and bounded output size.
 */
export function getGitDiff(
  workspaceDir: string,
  options: GitDiffOptions = {}
): GitDiffResult {
  if (!existsSync(workspaceDir)) {
    return {
      isGitRepo: false,
      diff: '',
      truncated: false,
      totalBytes: 0,
      error: `Workspace directory does not exist: ${workspaceDir}`
    };
  }

  const maxBytes = options.maxBytes || DEFAULT_MAX_DIFF_BYTES;
  const args = ['diff'];

  if (options.staged) {
    args.push('--staged');
  }

  // Safe pathspec
  if (options.path) {
    const normalizedWs = normalize(resolve(workspaceDir));
    const targetPath = normalize(resolve(workspaceDir, options.path));
    if (!targetPath.startsWith(normalizedWs)) {
      throw new Error(`Permission denied: Diff path "${options.path}" escapes workspace "${workspaceDir}"`);
    }
    const rel = relative(normalizedWs, targetPath);
    args.push('--', rel);
  }

  try {
    const rawDiff = execFileSync('git', args, {
      cwd: workspaceDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      timeout: 15000,
      maxBuffer: 4 * 1024 * 1024 // 4 MB buffer for git execution
    });

    const byteLen = Buffer.byteLength(rawDiff, 'utf8');
    let truncated = false;
    let diff = rawDiff;

    if (byteLen > maxBytes) {
      // Truncate cleanly at maxBytes
      const buf = Buffer.from(rawDiff, 'utf8');
      diff = buf.subarray(0, maxBytes).toString('utf8') + `\n\n[... Git diff truncated: ${byteLen} bytes exceeded ${maxBytes} bytes limit ...]`;
      truncated = true;
    }

    return {
      isGitRepo: true,
      diff,
      truncated,
      totalBytes: byteLen
    };
  } catch (err: any) {
    const stderr = err?.stderr?.toString() || err?.message || String(err);
    const isNotRepo = /not a git repository/i.test(stderr);
    const notFound = /ENOENT/i.test(stderr) || /command not found/i.test(stderr);

    return {
      isGitRepo: false,
      diff: '',
      truncated: false,
      totalBytes: 0,
      error: notFound
        ? 'Git binary not found on system PATH.'
        : isNotRepo
        ? 'Directory is not a git repository.'
        : `Git diff execution failed: ${stderr.trim()}`
    };
  }
}

