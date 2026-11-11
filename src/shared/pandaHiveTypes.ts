import type { StrawHatAgentConfig } from './strawHatAgents';
import type { RealBrowserTestReport } from '../main/browserTestRunner';

export type TaskGroup = 'group1' | 'group2';
export type TaskPhase = 'IDLE' | 'ARCHITECTING' | 'BUILDING' | 'VERIFYING' | 'REPAIRING' | 'COMPLETED' | 'BLOCKED' | 'FAILED';

export interface MilestoneRecord {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'BLOCKED';
  startedAt?: number;
  completedAt?: number;
  error?: string;
  durationMs?: number;
  summary?: string;
}

export interface PandaHiveTaskState {
  taskId: string;
  group: TaskGroup;
  projectName: string;
  prompt: string;
  status: TaskPhase;
  progress: number; // 0 to 100
  workspaceDir: string;
  assignedWorkers: {
    architect: StrawHatAgentConfig;
    builder: StrawHatAgentConfig;
    verifier: StrawHatAgentConfig;
    mascots: StrawHatAgentConfig[];
  };
  milestones: MilestoneRecord[];
  generatedFiles: string[];
  activeAgentId: string | null;
  currentStepDescription: string;
  error: string | null;
  qaReport?: RealBrowserTestReport;
  createdAt: number;
  updatedAt: number;
  repairTurn: number;
}

export type AgentHiveTaskState = PandaHiveTaskState;

export interface CafeOrder {
  id: string;
  servedToAgentId: string;
  servedToName: string;
  item: string;
  timestamp: number;
  message: string;
}

