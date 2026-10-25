"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AS_OF, BEFORE_ANSWER, COMPANY, GAP, HOLDING, HOLDING_SERIES, INDEX, INDEX_SERIES, MONTHS, QUESTION, VALUE, fmtAUD, fmtNum,
} from "./data";

const STEPS = [
  { key: "issue", label: "The question" },
  { key: "before", label: "Before: a wall of text" },
  { key: "line", label: "One line of code" },
  { key: "after", label: "After: a sourced card" },
  { key: "compare", label: "Side by side" },
  { key: "value", label: "The value" },
] as const;

function VercelMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" className={className} aria-hidden>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
    </svg>
  );
}

function SimBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 text-[11px] font-medium text-warn">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" /> Fictional company · simulated data
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-border bg-card ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{children}</div>;
}

function Bubble({ who, children }: { who: "user" | "bot"; children: React.ReactNode }) {
  if (who === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-[14px] text-black">{children}</div>
      </div>
    );
  return (
    <div className="flex gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card-2 text-[11px] font-semibold">B</div>
      <div className="min-w-0 flex-1 text-[14px] leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function AppFrame({ title, tone, children }: { title: string; tone?: "bad" | "good"; children: React.ReactNode }) {
  const ring = tone === "bad" ? "border-danger/40" : tone === "good" ? "border-success/40" : "border-border";
  return (
    <div className={`overflow-hidden rounded-xl border ${ring} bg-[#050505]`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-success/20 text-[10px] font-bold text-success">✿</span>
          <span className="text-[13px] font-medium">{COMPANY} assistant</span>
        </div>
        <span className="font-mono text-[11px] text-subtle">{title}</span>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

/* ---------- Generative UI card ---------- */

function LineChart({ animate = true }: { animate?: boolean }) {
  const W = 520, H = 210, padL = 36, padR = 56, padT = 14, padB = 26;
  const min = -4, max = 20;
  const x = (i: number) => padL + (i * (W - padL - padR)) / (MONTHS.length - 1);
  const y = (v: number) => padT + ((max - v) * (H - padT - padB)) / (max - min);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ticks = [0, 5, 10, 15, 20];
  const last = MONTHS.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Year to date: Wattle Minerals vs ASX 200 (simulated)">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#3a3a3a" : "#1c1c1c"} strokeDasharray={t === 0 ? "" : "3 4"} />
          <text x={padL - 8} y={y(t) + 3.5} fontSize="10" fill="#707070" textAnchor="end" fontFamily="var(--font-geist-mono)">{t > 0 ? `+${t}` : t}%</text>
        </g>
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 6} fontSize="10" fill="#707070" textAnchor="middle" fontFamily="var(--font-geist-mono)">{m}</text>
      ))}
      <path d={path(INDEX_SERIES)} fill="none" stroke="#707070" strokeWidth="2" className={animate ? "draw-line" : ""} />
      <path d={path(HOLDING_SERIES)} fill="none" stroke="#3ecf8e" strokeWidth="2.5" className={animate ? "draw-line" : ""} />
      <circle cx={x(last)} cy={y(HOLDING_SERIES[last])} r="4" fill="#3ecf8e" />
      <circle cx={x(last)} cy={y(INDEX_SERIES[last])} r="3.5" fill="#a1a1a1" />
      <text x={x(last) + 8} y={y(HOLDING_SERIES[last]) + 4} fontSize="11" fill="#3ecf8e" fontWeight="600">+{HOLDING.ytd}%</text>
      <text x={x(last) + 8} y={y(INDEX_SERIES[last]) + 4} fontSize="11" fill="#a1a1a1" fontWeight="600">+{INDEX.ytd}%</text>
    </svg>
  );
}

function SourceChip() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card-2 px-2.5 py-1 text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-blue" /> Source: market data via Tako Search (simulated)
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card-2 px-2.5 py-1 text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Data as of {AS_OF}
      </span>
    </div>
  );
}

function GenUICard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="fade-in overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="text-[13px] font-semibold">{HOLDING.name} ({HOLDING.ticker}) vs ASX 200 · 2026 year to date</div>
          <div className="mt-0.5 text-[11px] text-subtle">Your biggest holding · {fmtNum(HOLDING.shares)} shares · fictional company, simulated prices</div>
        </div>
        <div className="shrink-0 rounded-md bg-success/15 px-2 py-1 text-[12px] font-semibold text-success">+{GAP} pts ahead</div>
      </div>
      <div className="px-3 pt-3">
        <LineChart />
        <div className="flex items-center gap-4 px-2 pb-2 text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-success" /> {HOLDING.ticker}</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-[#707070]" /> ASX 200 (simulated)</span>
        </div>
      </div>
      {!compact && (
        <div className="border-t border-border">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-subtle">
                <th className="px-4 py-2 font-medium">Compare</th>
                <th className="px-2 py-2 text-right font-medium">1 Jan 2026</th>
                <th className="px-2 py-2 text-right font-medium">{AS_OF.replace(" market close", "")}</th>
                <th className="px-4 py-2 text-right font-medium">YTD</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-t border-border">
                <td className="px-4 py-2 font-sans">{HOLDING.ticker} share price</td>
                <td className="px-2 py-2 text-right text-muted">{fmtAUD(HOLDING.startPrice, 2)}</td>
                <td className="px-2 py-2 text-right">{fmtAUD(HOLDING.nowPrice, 2)}</td>
                <td className="px-4 py-2 text-right text-success">+{HOLDING.ytd}%</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2 font-sans">ASX 200 index</td>
                <td className="px-2 py-2 text-right text-muted">{INDEX.start.toLocaleString("en-AU", { minimumFractionDigits: 1 })}</td>
                <td className="px-2 py-2 text-right">{INDEX.now.toLocaleString("en-AU", { minimumFractionDigits: 1 })}</td>
                <td className="px-4 py-2 text-right text-muted">+{INDEX.ytd}%</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2 font-sans">Your {HOLDING.ticker} position</td>
                <td className="px-2 py-2 text-right text-muted">{fmtAUD(HOLDING.startValue)}</td>
                <td className="px-2 py-2 text-right">{fmtAUD(HOLDING.nowValue)}</td>
                <td className="px-4 py-2 text-right text-success">+{fmtAUD(HOLDING.gain)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t border-border px-4 py-3"><SourceChip /></div>
    </div>
  );
}

function AfterAnswer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-3">
      <p>
        {HOLDING.name} is up <b className="text-success">{HOLDING.ytd}%</b> this year, against <b>{INDEX.ytd}%</b> for the ASX 200.
        That puts your biggest holding <b>{GAP} points ahead</b> of the index, a gain of <b>{fmtAUD(HOLDING.gain)}</b> on your {fmtNum(HOLDING.shares)} shares.
      </p>
      <GenUICard compact={compact} />
    </div>
  );
}

function BeforeAnswer({ annotate = false }: { annotate?: boolean }) {
  return (
    <div className="space-y-3 text-[13.5px] text-muted">
      {BEFORE_ANSWER.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {annotate && (
        <div className="flex flex-wrap gap-2 pt-1">
          {["No source", "No as-of date", "No number to check", "“appears”, “likely”, “probably”"].map((t) => (
            <span key={t} className="rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-[11px] font-medium text-danger">✕ {t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Steps ---------- */

function StepIssue() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="space-y-5">
        <Eyebrow>The issue</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Customers ask about their money. They need numbers they can trust.</h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted">
          {COMPANY} is a fictional ANZ online investing platform with an AI assistant in the app. Every month customers ask it about{" "}
          <b className="text-foreground">{fmtNum(VALUE.questionsPerMonth)}</b> portfolio questions like this one. The question is simple. The answer has to be right, sourced and current.
        </p>
        <SimBadge />
      </div>
      <AppFrame title="in-app chat">
        <Bubble who="user">{QUESTION}</Bubble>
        <Bubble who="bot">
          <span className="inline-flex items-center gap-2 text-subtle"><span className="pulse-dot h-2 w-2 rounded-full bg-muted" /> Thinking…</span>
        </Bubble>
      </AppFrame>
    </div>
  );
}

function StepBefore() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
      <div className="space-y-5">
        <Eyebrow>Before</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">A wall of text nobody can check.</h2>
        <p className="text-[15px] leading-relaxed text-muted">
          The assistant only has words. No source, no date, no figure the customer can hold it to. So they do the sensible thing: they pick up the phone.
        </p>
        <Card className="p-5">
          <div className="text-[12px] text-subtle">Portfolio chats that end in a call to the contact centre</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-4xl font-semibold text-danger">{VALUE.callRateBefore}%</span>
            <span className="text-[13px] text-muted">= {fmtNum(VALUE.callsBefore)} “explain my portfolio” calls a month</span>
          </div>
          <div className="mt-3 text-[11px] text-subtle">Simulated</div>
        </Card>
      </div>
      <AppFrame title="today" tone="bad">
        <Bubble who="user">{QUESTION}</Bubble>
        <Bubble who="bot"><BeforeAnswer annotate /></Bubble>
        <div className="flex items-center gap-3 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2.5 text-[12.5px] text-danger">
          <span className="text-base">☎</span> Customer taps “Call us”. Wait time 14 min.
        </div>
      </AppFrame>
    </div>
  );
}

function CodeLine({ n, children, hl = false }: { n: number; children: React.ReactNode; hl?: boolean }) {
  return (
    <div className={`flex ${hl ? "bg-success/10 ring-1 ring-success/40" : ""} rounded`}>
      <span className="w-8 shrink-0 select-none pr-3 text-right text-[#4a4a4a]">{n}</span>
      <span className="whitespace-pre">{children}</span>
    </div>
  );
}

function StepLine() {
  const k = "text-purple", s = "text-success", c = "text-subtle";
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
      <div className="space-y-5">
        <Eyebrow>What we solve</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">One line gives the assistant real data.</h2>
        <p className="text-[15px] leading-relaxed text-muted">
          Tako Search is now a built-in tool on Vercel AI Gateway. The team adds it to the AI SDK call they already have. The answer comes back as structured data with its sources and dates, ready to show as a chart instead of a paragraph.
        </p>
        <ul className="space-y-2 text-[14px]">
          {["No new data-vendor contract", "No bespoke integration to build", "Vercel runs the search and bills it with AI Gateway"].map((t) => (
            <li key={t} className="flex items-center gap-2.5"><span className="text-success">✓</span>{t}</li>
          ))}
        </ul>
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="font-mono text-[12px] text-muted">app/api/assistant/route.ts</span>
          <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[11px] text-success">+1 line</span>
        </div>
        <div className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6">
          <CodeLine n={1}><span className={k}>import</span> {"{ gateway, streamText, stepCountIs }"} <span className={k}>from</span> <span className={s}>&apos;ai&apos;</span>;</CodeLine>
          <CodeLine n={2}>{" "}</CodeLine>
          <CodeLine n={3}><span className={k}>const</span> result = streamText({"{"}</CodeLine>
          <CodeLine n={4}>{"  model: assistantModel,  "}<span className={c}>{"// any model on AI Gateway"}</span></CodeLine>
          <CodeLine n={5}>{"  system: portfolioContext,"}</CodeLine>
          <CodeLine n={6}>{"  prompt: question,"}</CodeLine>
          <CodeLine n={7} hl>{"  tools: { tako_search: gateway.tools.takoSearch() },"}</CodeLine>
          <CodeLine n={8}>{"  stopWhen: stepCountIs(4),"}</CodeLine>
          <CodeLine n={9}>{"});"}</CodeLine>
        </div>
        <div className="border-t border-border px-4 py-2.5 text-[11px] text-subtle">Illustrative snippet based on the public AI SDK and AI Gateway docs</div>
      </Card>
    </div>
  );
}

function StepAfter() {
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [run]);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.3fr] lg:items-start">
      <div className="space-y-5">
        <Eyebrow>After</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">Same question. A sourced, dated answer.</h2>
        <p className="text-[15px] leading-relaxed text-muted">
          The assistant now fetches the data itself and shows it as UI: a chart, a comparison table, where the numbers came from and when. Not a paragraph to decode. Something the customer can read in five seconds and trust.
        </p>
        <button onClick={() => { setPhase(0); setRun((r) => r + 1); }} className="rounded-md border border-border bg-card-2 px-3 py-1.5 text-[13px] text-muted hover:border-[#444] hover:text-foreground">
          ↻ Replay answer
        </button>
      </div>
      <AppFrame title="with AI Gateway + Tako" tone="good">
        <Bubble who="user">{QUESTION}</Bubble>
        <Bubble who="bot">
          {phase === 0 && <span className="inline-flex items-center gap-2 text-subtle"><span className="pulse-dot h-2 w-2 rounded-full bg-muted" /> Thinking…</span>}
          {phase === 1 && (
            <div className="fade-in space-y-2">
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card-2 px-2.5 py-1.5 font-mono text-[11.5px] text-muted">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-blue" /> tako_search · “Wattle Minerals share price 2026 vs ASX 200”
              </div>
              <div className="shimmer h-40 rounded-lg" />
            </div>
          )}
          {phase === 2 && (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card-2 px-2.5 py-1.5 font-mono text-[11.5px] text-muted">
                <span className="text-success">✓</span> tako_search · 2 data cards · sourced and dated
              </div>
              <AfterAnswer />
            </div>
          )}
        </Bubble>
      </AppFrame>
    </div>
  );
}

function StepCompare() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Eyebrow>Side by side</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight">Same model. Same question. One line apart.</h2>
        </div>
        <SimBadge />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[13px] font-medium text-danger"><span className="h-2 w-2 rounded-full bg-danger" /> Before · text only</div>
          <AppFrame title="today" tone="bad">
            <Bubble who="user">{QUESTION}</Bubble>
            <Bubble who="bot"><BeforeAnswer annotate /></Bubble>
          </AppFrame>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[13px] font-medium text-success"><span className="h-2 w-2 rounded-full bg-success" /> After · Generative UI with Tako on AI Gateway</div>
          <AppFrame title="with AI Gateway + Tako" tone="good">
            <Bubble who="user">{QUESTION}</Bubble>
            <Bubble who="bot"><AfterAnswer compact /></Bubble>
          </AppFrame>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, before, after, note }: { label: string; before: string; after: string; note?: string }) {
  return (
    <Card className="p-5">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="whitespace-nowrap text-lg font-medium text-subtle line-through decoration-danger/60">{before}</span>
        <span className="text-subtle">→</span>
        <span className="whitespace-nowrap text-3xl font-semibold">{after}</span>
      </div>
      {note && <div className="mt-2 text-[12px] text-subtle">{note}</div>}
    </Card>
  );
}

function StepValue() {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Eyebrow>The value</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight">Trusted answers. Fewer calls. New capability in minutes.</h2>
        </div>
        <SimBadge />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Portfolio chats that end in a call" before={`${VALUE.callRateBefore}%`} after={`${VALUE.callRateAfter}%`} note={`of ${fmtNum(VALUE.questionsPerMonth)} questions a month`} />
        <Metric label="“Explain my portfolio” calls a month" before={fmtNum(VALUE.callsBefore)} after={fmtNum(VALUE.callsAfter)} note={`${fmtNum(VALUE.callsAvoided)} calls avoided`} />
        <Metric label="Answers rated helpful" before={`${VALUE.trustBefore}%`} after={`${VALUE.trustAfter}%`} note="Sourced and dated, so customers believe them" />
        <Metric label="Time to add a live-data capability" before={VALUE.shipBefore} after="Minutes" note="Contract + integration → one line of code" />
      </div>
      <Card className="grid-bg flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
        <div>
          <div className="text-[13px] text-muted">Contact centre cost avoided</div>
          <div className="mt-1 text-[13px] text-subtle">
            {fmtNum(VALUE.callsAvoided)} calls a month × {fmtAUD(VALUE.costPerCall, 2)} per call = {fmtAUD(VALUE.savedPerMonth)} a month
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-semibold tracking-tight sm:text-5xl">{fmtAUD(VALUE.savedPerYear)}</div>
          <div className="text-[12px] text-subtle">a year · simulated</div>
        </div>
      </Card>
      <p className="text-[12px] text-subtle">
        {COMPANY} and Wattle Minerals are fictional. Share prices, index values and business figures are simulated for illustration and are not market data or advice.
      </p>
    </div>
  );
}

/* ---------- Shell ---------- */

export default function Walkthrough() {
  const [step, setStep] = useState(0);
  const go = useCallback((n: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, n));
    setStep(next);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${next + 1}`);
  }, []);
  useEffect(() => {
    const n = parseInt(window.location.hash.replace("#", ""), 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (n >= 1 && n <= STEPS.length) setStep(n - 1);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go]);

  const views = [<StepIssue key="0" />, <StepBefore key="1" />, <StepLine key="2" />, <StepAfter key="3" />, <StepCompare key="4" />, <StepValue key="5" />];

  return (
    <div className="grid-bg flex min-h-screen flex-col">
      <header className="border-b border-border bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <VercelMark />
            <span className="text-[#333]">/</span>
            <span className="text-[14px] font-medium">AI Gateway</span>
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted sm:inline">Generative UI with Tako Search</span>
          </div>
          <div className="text-[12px] text-subtle">{COMPANY} · fictional, simulated</div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-3">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => go(i)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition ${
                i === step ? "bg-white text-black" : "text-muted hover:bg-card-2 hover:text-foreground"
              }`}
            >
              <span className={`font-mono text-[11px] ${i === step ? "text-black/60" : "text-subtle"}`}>{i + 1}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div key={step} className="fade-in">{views[step]}</div>
      </main>

      <footer className="border-t border-border bg-black/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button onClick={() => go(step - 1)} disabled={step === 0} className="rounded-md border border-border px-4 py-2 text-[13px] text-muted hover:text-foreground disabled:opacity-30">← Back</button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-white" : "w-1.5 bg-[#333]"}`} />
            ))}
          </div>
          <button onClick={() => go(step + 1)} disabled={step === STEPS.length - 1} className="rounded-md bg-white px-4 py-2 text-[13px] font-medium text-black hover:bg-[#ddd] disabled:opacity-30">Next →</button>
        </div>
      </footer>
    </div>
  );
}
