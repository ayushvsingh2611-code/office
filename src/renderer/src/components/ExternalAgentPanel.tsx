import { useState, useEffect } from 'react';
import { PixelPanel } from './PixelPanel';
import { PixelButton } from './PixelButton';
import { Icon } from './Icon';
import { useStore, type Agent, type ToolKind, type StationKind, type StatusKind } from '@/store/store';

interface ExternalAgentPanelProps {
  agent: Agent;
}

export function ExternalAgentPanel({ agent }: ExternalAgentPanelProps) {
  const [serverUrl, setServerUrl] = useState<string>('http://127.0.0.1:3737');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [customThought, setCustomThought] = useState('');
  const [sending, setSending] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [codeTab, setCodeTab] = useState<'python' | 'curl' | 'node'>('python');

  const updateAgent = useStore(s => s.updateAgent);
  const sleepAgent = useStore(s => s.sleepAgent);
  const wakeAgent = useStore(s => s.wakeAgent);
  const pushFeed = useStore(s => s.pushFeed);

  useEffect(() => {
    void window.cth.getExternalServerInfo?.().then(info => {
      if (info?.baseUrl) setServerUrl(info.baseUrl);
    });
  }, []);

  const eventEndpoint = `${serverUrl}/api/agent/${agent.id}/event`;
  const pollEndpoint = `${serverUrl}/api/agent/${agent.id}/poll`;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedSnippet(id);
        setTimeout(() => setCopiedSnippet(null), 2000);
      }
    } catch { /* clipboard fallback */ }
  };

  const saveWebhook = async () => {
    if (!webhookUrl.trim()) return;
    await window.cth.registerExternalWebhook?.(agent.id, webhookUrl.trim());
    setDispatchStatus({ msg: 'Webhook registered! Prompts will now auto-POST to your agent.', type: 'success' });
    setTimeout(() => setDispatchStatus(null), 4000);
  };

  const sendPromptToExternal = async () => {
    if (!promptInput.trim()) return;
    const text = promptInput.trim();
    setSending(true);
    setDispatchStatus(null);
    try {
      pushFeed(agent.id, `User: ${text}`);
      const res = await window.cth.dispatchExternalPrompt?.(agent.id, text);
      if (res?.dispatched) {
        setDispatchStatus({
          msg: res.method === 'webhook' ? '✓ Dispatched via Webhook to your external agent!' : '✓ Queued for agent poll (/api/agent/.../poll)',
          type: 'success'
        });
        setPromptInput('');
      } else {
        setDispatchStatus({
          msg: res?.error ? `Dispatch error: ${res.error}` : 'Queued in memory',
          type: 'info'
        });
      }
    } catch (e) {
      setDispatchStatus({ msg: e instanceof Error ? e.message : 'Error sending', type: 'error' });
    } finally {
      setSending(false);
      setTimeout(() => setDispatchStatus(null), 5000);
    }
  };

  // Floor simulation buttons
  const triggerFloorAction = (status: StatusKind, action: string, station?: StationKind, tool?: ToolKind) => {
    updateAgent(agent.id, {
      status,
      action,
      currentStation: station,
      carrying: tool,
      sleeping: false
    });
  };

  const submitCustomThought = () => {
    if (!customThought.trim()) return;
    updateAgent(agent.id, {
      action: customThought.trim(),
      status: 'working',
      sleeping: false
    });
    setCustomThought('');
  };

  const pythonSnippet = `# Connect your Python agent (LangChain / AutoGen / CrewAI / FastAPI)
import requests

PANDA_HIVE_URL = "${eventEndpoint}"

# 1. Animate avatar: walk to desk/shelf, carry tool, think
requests.post(PANDA_HIVE_URL, json={
    "status": "working",             # 'working' | 'thinking' | 'idle' | 'success' | 'sleeping'
    "action": "Analyzing codebase",  # Speech/thought bubble text
    "station": "shelf",              # 'desk' | 'shelf' | 'terminal' | 'web' | 'board'
    "tool": "Read",                  # 'Read' | 'Edit' | 'Write' | 'Bash' | 'WebSearch'
    "progress": 45
})

# 2. Check for prompts from Panda Hive floor (if not using webhook):
messages = requests.get("${pollEndpoint}").json()
for msg in messages.get("messages", []):
    print("User prompt from floor:", msg["text"])
`;

  const curlSnippet = `# Update avatar status & speech bubble
curl -X POST "${eventEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"working","action":"Scanning logs","station":"terminal","tool":"Bash"}'

# Poll user prompts queued in Panda Hive
curl "${pollEndpoint}"
`;

  const nodeSnippet = `// Node.js / Express external agent connection
const eventUrl = "${eventEndpoint}";

// Update avatar & thought bubble on floor
await fetch(eventUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "working",
    action: "Writing API tests...",
    station: "desk",
    tool: "Write"
  })
});
`;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--cth-paper-100)' }}>
      {/* Header Banner */}
      <div style={{
        padding: '10px 12px',
        background: 'var(--cth-bamboo-50, #f0f7f2)',
        boxShadow: 'inset 0 0 0 1px var(--cth-bamboo-600, #225a38)',
        display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <strong style={{ fontSize: 13, color: 'var(--cth-ink-900)' }}>External Agent API Connected</strong>
          </div>
          <span style={{ fontSize: 11, color: 'var(--cth-ink-500)', fontFamily: 'var(--cth-font-mono)' }}>PORT 3737</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--cth-ink-700)', lineHeight: '16px' }}>
          Connect your external Python / Node / LangChain agent. Send HTTP POST events to move this avatar, show speech bubbles, and receive user prompts.
        </div>
      </div>

      {/* Endpoint Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', fontFamily: 'var(--cth-font-display)', color: 'var(--cth-ink-700)' }}>
          API Event Endpoint
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            readOnly
            value={eventEndpoint}
            style={{
              flex: 1, padding: '6px 8px', fontSize: 12,
              fontFamily: 'var(--cth-font-mono)',
              background: 'var(--cth-paper-200)',
              border: 'none', boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)'
            }}
          />
          <PixelButton variant="secondary" size="sm" onClick={() => copyToClipboard(eventEndpoint, 'url')}>
            {copiedUrl ? 'Copied ✓' : 'Copy'}
          </PixelButton>
        </div>
      </div>

      {/* Optional Webhook Callback */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', fontFamily: 'var(--cth-font-display)', color: 'var(--cth-ink-700)' }}>
          Your Agent Webhook URL (Optional Callback)
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="e.g. http://localhost:8000/agent/prompt"
            style={{
              flex: 1, padding: '6px 8px', fontSize: 12,
              fontFamily: 'var(--cth-font-mono)',
              background: 'var(--cth-paper-200)',
              border: 'none', boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)'
            }}
          />
          <PixelButton variant="primary" size="sm" onClick={saveWebhook}>
            Save
          </PixelButton>
        </div>
        <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>
          When set, typing a message below will instantly POST to this URL.
        </span>
      </div>

      {/* Dispatch Message / Prompt to External Agent */}
      <div style={{
        padding: 10, background: 'var(--cth-cream-100)',
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
        display: 'flex', flexDirection: 'column', gap: 6
      }}>
        <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>Send Instruction / Prompt to External Agent</strong>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPromptToExternal()}
            placeholder="Type a task or instruction for this agent..."
            style={{
              flex: 1, padding: '6px 8px', fontSize: 13,
              background: 'var(--cth-paper-100)', border: 'none',
              boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)', outline: 'none'
            }}
          />
          <PixelButton variant="primary" size="sm" onClick={sendPromptToExternal} disabled={sending || !promptInput.trim()}>
            {sending ? '...' : 'Send'}
          </PixelButton>
        </div>

        {dispatchStatus && (
          <div style={{
            padding: '4px 8px', fontSize: 12,
            background: dispatchStatus.type === 'success' ? 'var(--cth-mint-light)' : 'var(--cth-cream-200)',
            color: 'var(--cth-ink-900)',
            boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)'
          }}>
            {dispatchStatus.msg}
          </div>
        )}
      </div>

      {/* Quick Avatar Controls (Live Playground) */}
      <div style={{
        padding: 10, background: 'var(--cth-cream-100)',
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>Avatar Actions (Quick Test)</strong>
          <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>Click to test animations</span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('working', 'searching files', 'shelf', 'Read')}>
            📚 Shelf (Read)
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('working', 'running shell script', 'terminal', 'Bash')}>
            💻 Terminal (Bash)
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('working', 'fetching docs', 'web', 'WebSearch')}>
            🌐 Web Search
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('working', 'editing code', 'desk', 'Edit')}>
            ✍️ Desk (Edit)
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('thinking', 'planning architecture', 'board')}>
            🧠 Thinking
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('success', 'all tasks complete!')}>
            🎉 Cheer (Done)
          </PixelButton>
          {agent.sleeping ? (
            <PixelButton variant="primary" size="sm" onClick={() => wakeAgent(agent.id)}>
              ☀️ Wake Up
            </PixelButton>
          ) : (
            <PixelButton variant="secondary" size="sm" onClick={() => sleepAgent(agent.id)}>
              🌙 Sleep (zzz)
            </PixelButton>
          )}
        </div>

        {/* Custom Speech Bubble */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <input
            value={customThought}
            onChange={(e) => setCustomThought(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitCustomThought()}
            placeholder="Type custom thought bubble above avatar..."
            style={{
              flex: 1, padding: '4px 8px', fontSize: 12,
              background: 'var(--cth-paper-100)', border: 'none',
              boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)', outline: 'none'
            }}
          />
          <PixelButton variant="secondary" size="sm" onClick={submitCustomThought} disabled={!customThought.trim()}>
            Say
          </PixelButton>
        </div>
      </div>

      {/* Code Snippets Accordion */}
      <div style={{
        padding: 10, background: 'var(--cth-paper-200)',
        boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
        display: 'flex', flexDirection: 'column', gap: 8
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>Integration Code Snippets</strong>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setCodeTab('python')}
              style={{
                border: 'none', padding: '2px 8px', fontSize: 11, cursor: 'pointer',
                background: codeTab === 'python' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              Python
            </button>
            <button
              onClick={() => setCodeTab('node')}
              style={{
                border: 'none', padding: '2px 8px', fontSize: 11, cursor: 'pointer',
                background: codeTab === 'node' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              Node.js
            </button>
            <button
              onClick={() => setCodeTab('curl')}
              style={{
                border: 'none', padding: '2px 8px', fontSize: 11, cursor: 'pointer',
                background: codeTab === 'curl' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              cURL
            </button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <pre style={{
            margin: 0, padding: 10, fontSize: 11, lineHeight: '16px',
            fontFamily: 'var(--cth-font-mono)',
            background: 'var(--cth-ink-900)', color: '#f8fafc',
            overflowX: 'auto', borderRadius: 2
          }}>
            {codeTab === 'python' ? pythonSnippet : codeTab === 'node' ? nodeSnippet : curlSnippet}
          </pre>
          <div style={{ position: 'absolute', top: 6, right: 6 }}>
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(codeTab === 'python' ? pythonSnippet : codeTab === 'node' ? nodeSnippet : curlSnippet, codeTab)}
            >
              {copiedSnippet === codeTab ? 'Copied ✓' : 'Copy'}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
