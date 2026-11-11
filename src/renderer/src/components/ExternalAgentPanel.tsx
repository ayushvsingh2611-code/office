import { useState, useEffect, useRef } from 'react';
import { PixelPanel } from './PixelPanel';
import { PixelButton } from './PixelButton';
import { Icon } from './Icon';
import { useStore, type Agent, type ToolKind, type StationKind, type StatusKind } from '@/store/store';
import { findLyzrConfig, callLyzrChat, type LyzrAgentConfig } from '@shared/lyzrAgents';

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
  const [codeTab, setCodeTab] = useState<'curl' | 'python' | 'node'>('curl');

  const updateAgent = useStore((s) => s.updateAgent);
  const sleepAgent = useStore((s) => s.sleepAgent);
  const wakeAgent = useStore((s) => s.wakeAgent);
  const pushFeed = useStore((s) => s.pushFeed);
  const feeds = useStore((s) => s.feeds[agent.id] ?? []);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isStrawHat = agent.id.startsWith('sh-') || agent.id === 'god';
  const lyzrConfig: LyzrAgentConfig | undefined = !isStrawHat ? findLyzrConfig(agent) : undefined;

  useEffect(() => {
    void window.cth.getExternalServerInfo?.().then((info) => {
      if (info?.baseUrl) setServerUrl(info.baseUrl);
    });
  }, []);

  // Listen for agent messages & events broadcast from backend
  useEffect(() => {
    const unsubMsg = window.cth.onExternalAgentMessage?.((e) => {
      if (e.agentId === agent.id || (agent.id === 'god' && (e.agentId === 'god' || e.agentId === 'sh-luffy'))) {
        setSending(false);
        pushFeed(agent.id, `${e.sender || agent.name}: ${e.text}`);
        updateAgent(agent.id, {
          status: 'idle',
          action: e.text.length > 50 ? `${e.text.slice(0, 48)}...` : e.text,
          recentAssistantText: e.text,
          recentTextTs: Date.now()
        });
        setDispatchStatus({ msg: `✓ Response from ${e.sender || agent.name}!`, type: 'success' });
      }
    });

    const unsubEvt = window.cth.onExternalAgentEvent?.((e) => {
      if (e.agentId === agent.id || (agent.id === 'god' && (e.agentId === 'god' || e.agentId === 'sh-luffy'))) {
        updateAgent(agent.id, {
          status: (e.status as any) || 'working',
          action: e.action || 'Working...',
          currentStation: (e.station as any) || agent.currentStation,
          carrying: (e.tool as any) || agent.carrying,
          sleeping: e.sleeping ?? false
        });
        if (e.status === 'idle') {
          setSending(false);
        }
      }
    });

    return () => {
      unsubMsg?.();
      unsubEvt?.();
    };
  }, [agent.id, agent.name, pushFeed, updateAgent]);

  // Auto-scroll chat feed to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [feeds.length]);

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
    } catch {
      /* clipboard fallback */
    }
  };

  const saveWebhook = async () => {
    if (!webhookUrl.trim()) return;
    await window.cth.registerExternalWebhook?.(agent.id, webhookUrl.trim());
    setDispatchStatus({ msg: 'Webhook registered! Prompts will now auto-POST to your agent.', type: 'success' });
    setTimeout(() => setDispatchStatus(null), 4000);
  };

  const sendPrompt = async (textToSend?: string) => {
    const raw = (textToSend ?? promptInput).trim();
    if (!raw || sending) return;

    setSending(true);
    setDispatchStatus(null);
    setPromptInput('');
    pushFeed(agent.id, `You: ${raw}`);

    if (isStrawHat) {
      updateAgent(agent.id, {
        status: 'working',
        action: 'Thinking with OmniRoute Antigravity AI...',
        sleeping: false
      });
    }

    try {
      // 1. Try dispatching via standard external server / mock
      const res = await window.cth.dispatchExternalPrompt?.(agent.id, raw);

      if (res?.dispatched) {
        setDispatchStatus({
          msg: isStrawHat ? '✓ Thinking via OmniRoute Antigravity Model...' : `✓ Prompt processed by ${lyzrConfig ? lyzrConfig.name : 'external agent'}!`,
          type: 'success'
        });
      } else if (res?.error) {
        // Direct browser fallback if IPC reported error or direct Lyzr call needed
        if (lyzrConfig) {
          updateAgent(agent.id, {
            status: 'working',
            action: 'Thinking...',
            currentStation: lyzrConfig.defaultStation,
            carrying: lyzrConfig.defaultTool,
            sleeping: false
          });
          pushFeed(agent.id, `User: ${raw}`);

          const reply = await callLyzrChat(lyzrConfig, raw);
          updateAgent(agent.id, {
            status: 'idle',
            action: reply.response.length > 50 ? `${reply.response.slice(0, 48)}...` : reply.response,
            recentAssistantText: reply.response,
            recentTextTs: Date.now(),
            contextTokens: reply.total_tokens
          });
          pushFeed(agent.id, `${lyzrConfig.name}: ${reply.response}`);
          setDispatchStatus({ msg: '✓ Response received from Lyzr AI Studio!', type: 'success' });
        } else {
          setDispatchStatus({ msg: `Dispatch error: ${res.error}`, type: 'error' });
        }
      }
    } catch (e) {
      if (lyzrConfig) {
        try {
          updateAgent(agent.id, { status: 'working', action: 'Thinking...', sleeping: false });
          pushFeed(agent.id, `User: ${raw}`);
          const reply = await callLyzrChat(lyzrConfig, raw);
          updateAgent(agent.id, {
            status: 'idle',
            action: reply.response.length > 50 ? `${reply.response.slice(0, 48)}...` : reply.response,
            recentAssistantText: reply.response,
            recentTextTs: Date.now(),
            contextTokens: reply.total_tokens
          });
          pushFeed(agent.id, `${lyzrConfig.name}: ${reply.response}`);
          setDispatchStatus({ msg: '✓ Response received from Lyzr API!', type: 'success' });
        } catch (innerErr) {
          setDispatchStatus({ msg: innerErr instanceof Error ? innerErr.message : 'Error sending', type: 'error' });
        }
      } else {
        setDispatchStatus({ msg: e instanceof Error ? e.message : 'Error sending', type: 'error' });
      }
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

  const curlSnippet = isStrawHat
    ? `# Send task prompt to ${agent.name} via AgentHive Multi-Engine Bridge
curl -X POST "${serverUrl}/api/external-agent/prompt" \\
  -H "Content-Type: application/json" \\
  -d '{"agentId": "${agent.id}", "text": "Hello ${agent.name}!"}'`
    : lyzrConfig
    ? `curl -X POST '${serverUrl.includes('localhost') ? 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/' : 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'}' \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: ${lyzrConfig.apiKey}' \\
  -d '{
    "user_id": "${lyzrConfig.userId}",
    "agent_id": "${lyzrConfig.agentId}",
    "session_id": "${lyzrConfig.sessionId}",
    "message": "Hello ${lyzrConfig.name}!"
  }'`
    : `# Update avatar status & speech bubble
curl -X POST "${eventEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"status":"working","action":"Scanning logs","station":"terminal","tool":"Bash"}'

# Poll user prompts queued in AgentHive
curl "${pollEndpoint}"`;

  const pythonSnippet = isStrawHat
    ? `import requests

url = "${serverUrl}/api/external-agent/prompt"
payload = {
    "agentId": "${agent.id}",
    "text": "Hello ${agent.name}!"
}
res = requests.post(url, json=payload)
print(res.json())`
    : lyzrConfig
    ? `import requests

url = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "${lyzrConfig.apiKey}"
}
payload = {
    "user_id": "${lyzrConfig.userId}",
    "agent_id": "${lyzrConfig.agentId}",
    "session_id": "${lyzrConfig.sessionId}",
    "message": "Hello from Python client"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json()["response"])`
    : `# Connect your Python agent (LangChain / AutoGen / CrewAI / FastAPI)
import requests

AGENT_HIVE_URL = "${eventEndpoint}"
requests.post(AGENT_HIVE_URL, json={
    "status": "working",
    "action": "Analyzing codebase",
    "station": "shelf",
    "tool": "Read"
})`;

  const nodeSnippet = isStrawHat
    ? `const res = await fetch("${serverUrl}/api/external-agent/prompt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agentId: "${agent.id}",
    text: "Hello ${agent.name}!"
  })
});
const data = await res.json();
console.log(data);`
    : lyzrConfig
    ? `const res = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${lyzrConfig.apiKey}"
  },
  body: JSON.stringify({
    user_id: "${lyzrConfig.userId}",
    agent_id: "${lyzrConfig.agentId}",
    session_id: "${lyzrConfig.sessionId}",
    message: "Hello from Node.js"
  })
});
const data = await res.json();
console.log(data.response);`
    : `const eventUrl = "${eventEndpoint}";
await fetch(eventUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "working", action: "Writing code...", station: "desk", tool: "Write" })
});`;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'var(--cth-paper-100)'
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: '10px 12px',
          background: isStrawHat ? 'var(--cth-bamboo-50, #f0f7f2)' : lyzrConfig ? 'var(--cth-mint-light, #e8f9ee)' : 'var(--cth-bamboo-50, #f0f7f2)',
          boxShadow: `inset 0 0 0 1px ${isStrawHat ? '#3b82f6' : lyzrConfig ? 'var(--cth-mint, #22c55e)' : 'var(--cth-bamboo-600, #225a38)'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                boxShadow: '0 0 6px #22c55e'
              }}
            />
            <strong style={{ fontSize: 13, color: 'var(--cth-ink-900)' }}>
              {isStrawHat ? `Straw Hat Crew · ${agent.name}` : lyzrConfig ? `Lyzr AI Studio · ${lyzrConfig.name}` : 'External Agent API Connected'}
            </strong>
          </div>
          <span
            style={{
              fontSize: 10,
              padding: '2px 6px',
              background: 'var(--cth-ink-900)',
              color: '#fff',
              fontFamily: 'var(--cth-font-mono)'
            }}
          >
            {isStrawHat
              ? (agent.id === 'sh-franky' ? 'STITCH + GEMINI' : ['sh-brook', 'sh-sanji', 'sh-robin'].includes(agent.id) ? 'GROQ CLOUD' : 'GEMINI 3X POOL')
              : lyzrConfig
              ? 'LYZR CLOUD'
              : 'PORT 3737'}
          </span>
        </div>

        <div style={{ fontSize: 12, color: 'var(--cth-ink-800)', lineHeight: '16px' }}>
          {isStrawHat
            ? `${agent.description || 'Specialist AI Agent'}`
            : lyzrConfig
            ? `${lyzrConfig.role} — ${lyzrConfig.description}`
            : 'Connect your external Python / Node / LangChain agent. Send HTTP POST events to move this avatar, show speech bubbles, and receive user prompts.'}
        </div>

        {lyzrConfig && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 4,
              fontSize: 11,
              fontFamily: 'var(--cth-font-mono)',
              color: 'var(--cth-ink-600)'
            }}
          >
            <span>
              <strong>Agent ID:</strong> {lyzrConfig.agentId.slice(0, 10)}…
            </span>
            <span>
              <strong>Session ID:</strong> {lyzrConfig.sessionId.slice(-8)}
            </span>
            <span>
              <strong>User:</strong> {lyzrConfig.userId}
            </span>
            {agent.contextTokens && (
              <span style={{ color: '#16a34a' }}>
                <strong>Tokens:</strong> {agent.contextTokens}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Live Chat / Activity Feed */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--cth-paper-200)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-200)',
          borderRadius: 2
        }}
      >
        <div
          style={{
            padding: '6px 10px',
            borderBottom: '1px solid var(--cth-ink-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              fontFamily: 'var(--cth-font-display)',
              color: 'var(--cth-ink-700)'
            }}
          >
            💬 Live Agent Conversation &amp; Feed
          </span>
          <span style={{ fontSize: 10, color: 'var(--cth-ink-500)' }}>{feeds.length} messages</span>
        </div>

        <div
          style={{
            maxHeight: 220,
            minHeight: 110,
            overflowY: 'auto',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          {feeds.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: 'var(--cth-ink-500)' }}>
              No messages yet. Send an instruction below to chat with {agent.name}!
            </div>
          ) : (
            feeds.map((line, idx) => {
              const isUser = line.startsWith('User:') || line.startsWith('You:');
              const isError = line.startsWith('[Error]');
              return (
                <div
                  key={idx}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 2,
                    fontSize: 12,
                    lineHeight: '16px',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    background: isError
                      ? 'var(--cth-coral-light, #fee2e2)'
                      : isUser
                      ? 'var(--cth-cream-300, #eedfc5)'
                      : 'var(--cth-paper-100, #ffffff)',
                    color: 'var(--cth-ink-900)',
                    boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
                    fontFamily: isUser ? 'var(--cth-font-ui)' : 'var(--cth-font-mono)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {line}
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Quick Prompt Chips (Tailored to Agent Role) */}
      {lyzrConfig && lyzrConfig.quickPrompts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              fontFamily: 'var(--cth-font-display)',
              color: 'var(--cth-ink-600)'
            }}
          >
            💡 Quick Role Suggestions
          </span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {lyzrConfig.quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => sendPrompt(qp)}
                disabled={sending}
                style={{
                  border: 'none',
                  background: 'var(--cth-cream-200)',
                  boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
                  padding: '3px 8px',
                  fontSize: 11,
                  fontFamily: 'var(--cth-font-ui)',
                  cursor: sending ? 'wait' : 'pointer',
                  color: 'var(--cth-ink-900)',
                  borderRadius: 2,
                  textAlign: 'left'
                }}
              >
                + {qp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Send Instruction / Prompt */}
      <div
        style={{
          padding: 10,
          background: 'var(--cth-cream-100)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>
          {`Ask ${agent.name} (${agent.description?.slice(0, 30) || 'Specialist'})`}
        </strong>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
            disabled={sending}
            placeholder={`Type a task for ${agent.name}...`}
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: 13,
              background: 'var(--cth-paper-100)',
              border: 'none',
              boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)',
              outline: 'none'
            }}
          />
          <PixelButton variant="primary" size="sm" onClick={() => sendPrompt()} disabled={sending || !promptInput.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </PixelButton>
        </div>

        {dispatchStatus && (
          <div
            style={{
              padding: '4px 8px',
              fontSize: 12,
              background: dispatchStatus.type === 'success' ? 'var(--cth-mint-light)' : 'var(--cth-cream-200)',
              color: 'var(--cth-ink-900)',
              boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)'
            }}
          >
            {dispatchStatus.msg}
          </div>
        )}
      </div>

      {/* Quick Avatar Controls (Live Playground on Office Floor) */}
      <div
        style={{
          padding: 10,
          background: 'var(--cth-cream-100)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>Avatar Actions (Office Floor Animations)</strong>
          <span style={{ fontSize: 11, color: 'var(--cth-ink-500)' }}>Test movement &amp; tools</span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => triggerFloorAction('working', 'searching documentation', 'shelf', 'Read')}
          >
            📚 Shelf (Read)
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => triggerFloorAction('working', 'running terminal scripts', 'terminal', 'Bash')}
          >
            💻 Terminal (Bash)
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => triggerFloorAction('working', 'fetching web resources', 'web', 'WebSearch')}
          >
            🌐 Web Search
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => triggerFloorAction('working', 'writing and editing code', 'desk', 'Edit')}
          >
            ✍️ Desk (Edit)
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => triggerFloorAction('thinking', 'planning architecture', 'board')}
          >
            🧠 Thinking
          </PixelButton>
          <PixelButton variant="secondary" size="sm" onClick={() => triggerFloorAction('success', 'tasks finished successfully!')}>
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
            placeholder="Type speech bubble to show above avatar on floor..."
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: 12,
              background: 'var(--cth-paper-100)',
              border: 'none',
              boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
              color: 'var(--cth-ink-900)',
              outline: 'none'
            }}
          />
          <PixelButton variant="secondary" size="sm" onClick={submitCustomThought} disabled={!customThought.trim()}>
            Say
          </PixelButton>
        </div>
      </div>

      {/* Code Snippets Accordion */}
      <div
        style={{
          padding: 10,
          background: 'var(--cth-paper-200)',
          boxShadow: 'inset 0 0 0 1px var(--cth-ink-300)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 12, color: 'var(--cth-ink-900)' }}>
            {`API Integration Snippets (${agent.name})`}
          </strong>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setCodeTab('curl')}
              style={{
                border: 'none',
                padding: '2px 8px',
                fontSize: 11,
                cursor: 'pointer',
                background: codeTab === 'curl' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              cURL
            </button>
            <button
              onClick={() => setCodeTab('python')}
              style={{
                border: 'none',
                padding: '2px 8px',
                fontSize: 11,
                cursor: 'pointer',
                background: codeTab === 'python' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              Python
            </button>
            <button
              onClick={() => setCodeTab('node')}
              style={{
                border: 'none',
                padding: '2px 8px',
                fontSize: 11,
                cursor: 'pointer',
                background: codeTab === 'node' ? 'var(--cth-mint-light)' : 'transparent',
                color: 'var(--cth-ink-900)'
              }}
            >
              Node.js
            </button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <pre
            style={{
              margin: 0,
              padding: 10,
              fontSize: 11,
              lineHeight: '16px',
              fontFamily: 'var(--cth-font-mono)',
              background: 'var(--cth-ink-900)',
              color: '#f8fafc',
              overflowX: 'auto',
              borderRadius: 2
            }}
          >
            {codeTab === 'python' ? pythonSnippet : codeTab === 'node' ? nodeSnippet : curlSnippet}
          </pre>
          <div style={{ position: 'absolute', top: 6, right: 6 }}>
            <PixelButton
              variant="secondary"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  codeTab === 'python' ? pythonSnippet : codeTab === 'node' ? nodeSnippet : curlSnippet,
                  codeTab
                )
              }
            >
              {copiedSnippet === codeTab ? 'Copied ✓' : 'Copy'}
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
