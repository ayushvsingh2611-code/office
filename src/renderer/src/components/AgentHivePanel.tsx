import { useEffect, useState } from 'react';
import { PixelPanel } from './PixelPanel';
import { PixelButton } from './PixelButton';
import { Icon } from './Icon';
import { useStore } from '@/store/store';
import { STRAW_HAT_CREW } from '@shared/strawHatAgents';
import type { PandaHiveTaskState as AgentHiveTaskState, CafeOrder, MilestoneRecord } from '@shared/pandaHiveTypes';

export const CAFE_MENU = [
  { id: 'coffee', name: '☕ Hot Black Coffee', desc: 'Focus +50% for Builders' },
  { id: 'tea', name: '🍵 Green Tea Latte', desc: 'Calms Architects for clear blueprints' },
  { id: 'ramen', name: '🍜 Straw Hat Pork Ramen', desc: 'Full-stack meal for Verifiers' },
  { id: 'bento', name: '🍱 Pirate Bento Box', desc: 'Delicious energy pack for the floor' },
  { id: 'juice', name: '🧃 Tangerine Juice', desc: 'Nami’s favorite refreshing drink' }
];

export interface AgentHivePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export function AgentHivePanel({ isOpen = true, onClose, isModal = true }: AgentHivePanelProps) {
  const [taskA, setTaskA] = useState<AgentHiveTaskState | null>(null);
  const [taskB, setTaskB] = useState<AgentHiveTaskState | null>(null);
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [projectNameA, setProjectNameA] = useState('');
  const [projectNameB, setProjectNameB] = useState('');
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [selectedCafeItem, setSelectedCafeItem] = useState(CAFE_MENU[0].name);
  const [selectedAgentId, setSelectedAgentId] = useState(STRAW_HAT_CREW[1].id); // Nami
  const [cafeFeed, setCafeFeed] = useState<CafeOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'cafe'>('tasks');

  const pushFeed = useStore((s) => s.pushFeed);

  // Poll / subscribe to live task updates
  useEffect(() => {
    const fetchTasks = window.cth.agentHiveAllTasks ?? window.cth.pandaHiveAllTasks;
    fetchTasks?.().then((tasks) => {
      if (Array.isArray(tasks)) {
        const a = tasks.filter((t) => t.group === 'group1').sort((x, y) => y.createdAt - x.createdAt)[0];
        const b = tasks.filter((t) => t.group === 'group2').sort((x, y) => y.createdAt - x.createdAt)[0];
        if (a) setTaskA(a);
        if (b) setTaskB(b);
      }
    });

    const onUpdate = window.cth.onAgentHiveTaskUpdated ?? window.cth.onPandaHiveTaskUpdated;
    const unsubscribe = onUpdate?.((task) => {
      if (task.group === 'group1') {
        setTaskA(task);
        if (task.status === 'COMPLETED' || task.status === 'BLOCKED' || task.status === 'FAILED') {
          setLoadingA(false);
        }
      } else if (task.group === 'group2') {
        setTaskB(task);
        if (task.status === 'COMPLETED' || task.status === 'BLOCKED' || task.status === 'FAILED') {
          setLoadingB(false);
        }
      }

      if (task.activeAgentId) {
        pushFeed(task.activeAgentId, `[${task.group.toUpperCase()}] ${task.currentStepDescription}`);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [pushFeed]);

  const handleLaunchTaskA = async () => {
    if (!promptA.trim() || loadingA) return;
    setLoadingA(true);
    const runTask = window.cth.agentHiveRunTask ?? window.cth.pandaHiveRunTask;
    const res = await runTask({
      group: 'group1',
      prompt: promptA.trim(),
      projectName: projectNameA.trim() || undefined
    });
    if (res.ok && res.task) {
      setTaskA(res.task);
      pushFeed('sh-luffy', `Luffy assigned Task A to Group 1 (Nami, Zoro, Sanji): "${promptA.trim()}"`);
    } else {
      setLoadingA(false);
      alert(`Failed to launch Task A: ${res.error || 'Unknown error'}`);
    }
  };

  const handleLaunchTaskB = async () => {
    if (!promptB.trim() || loadingB) return;
    setLoadingB(true);
    const runTask = window.cth.agentHiveRunTask ?? window.cth.pandaHiveRunTask;
    const res = await runTask({
      group: 'group2',
      prompt: promptB.trim(),
      projectName: projectNameB.trim() || undefined
    });
    if (res.ok && res.task) {
      setTaskB(res.task);
      pushFeed('sh-luffy', `Luffy assigned Task B to Group 2 (Robin, Shanks, Hancock): "${promptB.trim()}"`);
    } else {
      setLoadingB(false);
      alert(`Failed to launch Task B: ${res.error || 'Unknown error'}`);
    }
  };

  const handleServeCafe = async () => {
    const serveCafe = window.cth.agentHiveUsoppServe ?? window.cth.pandaHiveUsoppServe;
    const res = await serveCafe({
      agentId: selectedAgentId,
      item: selectedCafeItem
    });
    if (res.ok && res.order) {
      setCafeFeed((prev) => [res.order!, ...prev.slice(0, 9)]);
      pushFeed('sh-usopp', res.order.message);
      pushFeed(selectedAgentId, `Received ${selectedCafeItem} from Usopp! Feeling energized!`);
    }
  };

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span style={{ color: 'var(--cth-mint)', fontWeight: 'bold' }}>✓ COMPLETED</span>;
      case 'ARCHITECTING':
      case 'BUILDING':
      case 'VERIFYING':
      case 'REPAIRING':
        return <span style={{ color: 'var(--cth-lemon)', fontWeight: 'bold' }}>⚡ {status}</span>;
      case 'BLOCKED':
        return <span style={{ color: 'var(--cth-coral)', fontWeight: 'bold' }}>⛔ BLOCKED</span>;
      case 'FAILED':
        return <span style={{ color: 'var(--cth-coral)', fontWeight: 'bold' }}>✕ FAILED</span>;
      default:
        return <span style={{ color: 'var(--cth-ink-500)' }}>IDLE</span>;
    }
  };

  if (!isOpen) return null;

  const content = (
    <PixelPanel
      variant="dialog"
      title="AGENTHIVE · DUAL-GROUP CONCURRENT ORCHESTRATOR"
      noPadding
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header controls & tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid var(--cth-ink-300)',
        background: 'var(--cth-cream-100)'
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '4px 12px',
              fontFamily: 'var(--cth-font-ui)',
              fontSize: 12,
              fontWeight: activeTab === 'tasks' ? 'bold' : 'normal',
              background: activeTab === 'tasks' ? 'var(--cth-paper-100)' : 'transparent',
              border: '1px solid var(--cth-ink-300)',
              cursor: 'pointer'
            }}
          >
            🚀 Dual Sprint Tasks (Task A & Task B)
          </button>
          <button
            onClick={() => setActiveTab('cafe')}
            style={{
              padding: '4px 12px',
              fontFamily: 'var(--cth-font-ui)',
              fontSize: 12,
              fontWeight: activeTab === 'cafe' ? 'bold' : 'normal',
              background: activeTab === 'cafe' ? 'var(--cth-paper-100)' : 'transparent',
              border: '1px solid var(--cth-ink-300)',
              cursor: 'pointer'
            }}
          >
            ☕ Usopp’s Office Café Menu
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>
            Models: Architect (3.8 High) · Builder (3.0 Flash) · Verifier (3.8 Med)
          </span>
          {onClose && (
            <PixelButton variant="ghost" size="sm" onClick={onClose}>
              ✕ Close
            </PixelButton>
          )}
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          padding: 16,
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* TASK A — GROUP 1 */}
          <PixelPanel
            variant="inset"
            title="TASK A — GROUP 1 SQUAD"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <span>
                <strong>Active Workers:</strong> Nami (Arch) · Zoro (Builder) · Sanji (QA)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {taskA?.generatedFiles?.some((f) => f.includes('index.html')) && (
                  <PixelButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const openPreview = (window.cth as any).agentHiveOpenPreview ?? (window.cth as any).pandaHiveOpenPreview;
                      if (taskA.workspaceDir) void openPreview?.(taskA.workspaceDir);
                    }}
                  >
                    <span>👁️ Live Preview</span>
                  </PixelButton>
                )}
                {renderStatusBadge(taskA?.status)}
              </div>
            </div>

            <div style={{ fontSize: 10, color: 'var(--cth-ink-500)' }}>
              Visual Mascots: Chopper, Brook (0 AI calls)
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Sprint Task Prompt (e.g., create board game ludo)..."
                value={promptA}
                onChange={(e) => setPromptA(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLaunchTaskA(); }}
                disabled={loadingA || taskA?.status === 'BUILDING' || taskA?.status === 'ARCHITECTING'}
                style={{
                  flex: 2,
                  padding: '6px 10px',
                  fontFamily: 'var(--cth-font-ui)',
                  fontSize: 12,
                  border: '1px solid var(--cth-ink-300)',
                  background: 'var(--cth-paper-100)',
                  color: 'var(--cth-ink-900)'
                }}
              />
              <input
                type="text"
                placeholder="Folder (e.g. ludo-game)..."
                value={projectNameA}
                onChange={(e) => setProjectNameA(e.target.value)}
                disabled={loadingA || taskA?.status === 'BUILDING' || taskA?.status === 'ARCHITECTING'}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontFamily: 'var(--cth-font-ui)',
                  fontSize: 11,
                  border: '1px solid var(--cth-ink-300)',
                  background: 'var(--cth-paper-100)',
                  color: 'var(--cth-ink-700)'
                }}
              />
              <PixelButton
                variant="primary"
                size="sm"
                onClick={handleLaunchTaskA}
                disabled={loadingA || !promptA.trim() || taskA?.status === 'BUILDING'}
              >
                {loadingA ? 'Launching...' : 'Run Task A'}
              </PixelButton>
            </div>

            {taskA && (
              <div style={{
                marginTop: 6,
                padding: 10,
                background: 'var(--cth-cream-100)',
                border: '1px solid var(--cth-ink-300)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span><strong>Sprint Task:</strong> {taskA.prompt}</span>
                  <span><strong>Progress:</strong> {taskA.progress}%</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--cth-paper-100)',
                  padding: '5px 8px',
                  border: '1px solid var(--cth-ink-300)',
                  fontSize: 11
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ fontWeight: 'bold' }}>📂 Workspace:</span>
                    <span style={{ color: 'var(--cth-panda-green, #10B981)', fontFamily: 'var(--cth-font-mono)', fontWeight: 600 }}>
                      workspace/{taskA.projectName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {taskA.generatedFiles?.some((f) => f.includes('index.html')) && (
                      <PixelButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const openPreview = (window.cth as any).agentHiveOpenPreview ?? (window.cth as any).pandaHiveOpenPreview;
                          if (taskA.workspaceDir) void openPreview?.(taskA.workspaceDir);
                        }}
                      >
                        <span>👁️ Live Preview</span>
                      </PixelButton>
                    )}
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const openFolder = (window.cth as any).agentHiveOpenFolder ?? (window.cth as any).pandaHiveOpenFolder;
                        if (taskA.workspaceDir) void openFolder?.(taskA.workspaceDir);
                      }}
                    >
                      <span>📂 Explorer</span>
                    </PixelButton>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--cth-ink-700)' }}>
                  {taskA.currentStepDescription}
                </div>

                {/* Milestones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 'bold' }}>Milestones</span>
                  {taskA.milestones.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        padding: '3px 6px',
                        background: 'var(--cth-paper-100)',
                        borderLeft: `3px solid ${m.status === 'COMPLETED' ? 'var(--cth-mint)' :
                            m.status === 'IN_PROGRESS' ? 'var(--cth-lemon)' :
                              m.status === 'BLOCKED' ? 'var(--cth-coral)' : 'var(--cth-ink-300)'
                          }`
                      }}
                    >
                      <span>{m.title} ({m.agentName})</span>
                      <span style={{ fontWeight: 600 }}>{m.status}</span>
                    </div>
                  ))}
                </div>

                {/* Generated Files */}
                {taskA.generatedFiles && taskA.generatedFiles.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11 }}>
                    <strong>Generated Files:</strong>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {taskA.generatedFiles.map((f, i) => (
                        <span key={i} style={{ background: 'var(--cth-paper-100)', padding: '2px 6px', borderRadius: 2 }}>
                          📄 {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {taskA.error && (
                  <div style={{ color: 'var(--cth-coral)', fontSize: 11, marginTop: 4 }}>
                    <strong>Error / Recovery:</strong> {taskA.error}
                  </div>
                )}
              </div>
            )}
          </PixelPanel>

          {/* TASK B — GROUP 2 */}
          <PixelPanel
            variant="inset"
            title="TASK B — GROUP 2 SQUAD"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <span>
                <strong>Active Workers:</strong> Robin (Arch) · Shanks (Builder) · Hancock (QA)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {taskB?.generatedFiles?.some((f) => f.includes('index.html')) && (
                  <PixelButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const openPreview = (window.cth as any).agentHiveOpenPreview ?? (window.cth as any).pandaHiveOpenPreview;
                      if (taskB.workspaceDir) void openPreview?.(taskB.workspaceDir);
                    }}
                  >
                    <span>👁️ Live Preview</span>
                  </PixelButton>
                )}
                {renderStatusBadge(taskB?.status)}
              </div>
            </div>

            <div style={{ fontSize: 10, color: 'var(--cth-ink-500)' }}>
              Visual Mascots: Jinbe, Franky (0 AI calls)
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Concurrent Task B Prompt (e.g. calculator app)..."
                value={promptB}
                onChange={(e) => setPromptB(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLaunchTaskB(); }}
                disabled={loadingB || taskB?.status === 'BUILDING' || taskB?.status === 'ARCHITECTING'}
                style={{
                  flex: 2,
                  padding: '6px 10px',
                  fontFamily: 'var(--cth-font-ui)',
                  fontSize: 12,
                  border: '1px solid var(--cth-ink-300)',
                  background: 'var(--cth-paper-100)',
                  color: 'var(--cth-ink-900)'
                }}
              />
              <input
                type="text"
                placeholder="Folder (e.g. calculator)..."
                value={projectNameB}
                onChange={(e) => setProjectNameB(e.target.value)}
                disabled={loadingB || taskB?.status === 'BUILDING' || taskB?.status === 'ARCHITECTING'}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontFamily: 'var(--cth-font-ui)',
                  fontSize: 11,
                  border: '1px solid var(--cth-ink-300)',
                  background: 'var(--cth-paper-100)',
                  color: 'var(--cth-ink-700)'
                }}
              />
              <PixelButton
                variant="primary"
                size="sm"
                onClick={handleLaunchTaskB}
                disabled={loadingB || !promptB.trim() || taskB?.status === 'BUILDING'}
              >
                {loadingB ? 'Launching...' : 'Run Task B'}
              </PixelButton>
            </div>

            {taskB && (
              <div style={{
                marginTop: 6,
                padding: 10,
                background: 'var(--cth-cream-100)',
                border: '1px solid var(--cth-ink-300)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span><strong>Sprint Task:</strong> {taskB.prompt}</span>
                  <span><strong>Progress:</strong> {taskB.progress}%</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--cth-paper-100)',
                  padding: '5px 8px',
                  border: '1px solid var(--cth-ink-300)',
                  fontSize: 11
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ fontWeight: 'bold' }}>📂 Workspace:</span>
                    <span style={{ color: 'var(--cth-panda-green, #10B981)', fontFamily: 'var(--cth-font-mono)', fontWeight: 600 }}>
                      workspace/{taskB.projectName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {taskB.generatedFiles?.some((f) => f.includes('index.html')) && (
                      <PixelButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const openPreview = (window.cth as any).agentHiveOpenPreview ?? (window.cth as any).pandaHiveOpenPreview;
                          if (taskB.workspaceDir) void openPreview?.(taskB.workspaceDir);
                        }}
                      >
                        <span>👁️ Live Preview</span>
                      </PixelButton>
                    )}
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const openFolder = (window.cth as any).agentHiveOpenFolder ?? (window.cth as any).pandaHiveOpenFolder;
                        if (taskB.workspaceDir) void openFolder?.(taskB.workspaceDir);
                      }}
                    >
                      <span>📂 Explorer</span>
                    </PixelButton>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--cth-ink-700)' }}>
                  {taskB.currentStepDescription}
                </div>

                {/* Milestones */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 'bold' }}>Milestones</span>
                  {taskB.milestones.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        padding: '3px 6px',
                        background: 'var(--cth-paper-100)',
                        borderLeft: `3px solid ${m.status === 'COMPLETED' ? 'var(--cth-mint)' :
                            m.status === 'IN_PROGRESS' ? 'var(--cth-lemon)' :
                              m.status === 'BLOCKED' ? 'var(--cth-coral)' : 'var(--cth-ink-300)'
                          }`
                      }}
                    >
                      <span>{m.title} ({m.agentName})</span>
                      <span style={{ fontWeight: 600 }}>{m.status}</span>
                    </div>
                  ))}
                </div>

                {/* Generated Files */}
                {taskB.generatedFiles && taskB.generatedFiles.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11 }}>
                    <strong>Generated Files:</strong>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {taskB.generatedFiles.map((f, i) => (
                        <span key={i} style={{ background: 'var(--cth-paper-100)', padding: '2px 6px', borderRadius: 2 }}>
                          📄 {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {taskB.error && (
                  <div style={{ color: 'var(--cth-coral)', fontSize: 11, marginTop: 4 }}>
                    <strong>Error / Recovery:</strong> {taskB.error}
                  </div>
                )}
              </div>
            )}
          </PixelPanel>
        </div>
      ) : (
        /* USOPO CAFÉ TAB */
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Café Menu Picker */}
            <PixelPanel variant="inset" title="USOPP'S ORDER DESK" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
              <span style={{ fontSize: 12 }}>
                Order snacks or beverages for the team! Usopp the Café Waiter will walk to the breakroom and serve them.
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 'bold' }}>Choose Menu Item:</label>
                <select
                  value={selectedCafeItem}
                  onChange={(e) => setSelectedCafeItem(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    fontFamily: 'var(--cth-font-ui)',
                    fontSize: 12,
                    border: '1px solid var(--cth-ink-300)',
                    background: 'var(--cth-paper-100)'
                  }}
                >
                  {CAFE_MENU.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} — {item.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 'bold' }}>Deliver To Agent:</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    fontFamily: 'var(--cth-font-ui)',
                    fontSize: 12,
                    border: '1px solid var(--cth-ink-300)',
                    background: 'var(--cth-paper-100)'
                  }}
                >
                  {STRAW_HAT_CREW.filter((a) => a.id !== 'sh-usopp').map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>

              <PixelButton variant="primary" size="md" onClick={handleServeCafe}>
                🍵 Send Usopp to Serve Now!
              </PixelButton>
            </PixelPanel>

            {/* Live Café Orders Feed */}
            <PixelPanel variant="inset" title="CAFÉ ACTIVITY LOG" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 14 }}>
              {cafeFeed.length === 0 ? (
                <span style={{ fontSize: 12, color: 'var(--cth-ink-500)', fontStyle: 'italic' }}>
                  No orders placed yet. Select an item above and have Usopp serve your team!
                </span>
              ) : (
                cafeFeed.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      padding: '6px 10px',
                      background: 'var(--cth-cream-100)',
                      borderLeft: '3px solid var(--cth-mint)',
                      fontSize: 11,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{order.message}</span>
                    <span style={{ color: 'var(--cth-ink-500)', fontSize: 10 }}>
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </PixelPanel>
          </div>
        </div>
      )}
    </PixelPanel>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 48,
      left: 32,
      right: 32,
      bottom: 48,
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
    }}>
      {content}
    </div>
  );
}

export const PandaHivePanel = AgentHivePanel;

