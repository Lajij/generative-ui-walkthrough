# Generative UI with Tako on Vercel AI Gateway: Banksia Invest walkthrough

A story-first, fully simulated sales walkthrough. A customer of a fictional ANZ investing platform asks the in-app assistant how their biggest holding has done against the ASX 200 this year. Before, the assistant answers with unsourced, undated paragraphs and customers call the contact centre. After adding Tako Search on Vercel AI Gateway with one line (`tools: { tako_search: gateway.tools.takoSearch() }`), the same question returns a sourced, dated chart card and comparison table.

- Live: https://generative-ui-walkthrough.vercel.app
- `TALK_TRACK.md`: 2 to 3 minute spoken script with click cues
- `LINKEDIN_CAPTION.md`: post copy
- Deep links: `/#1` to `/#6`; arrow keys move between steps

Everything runs client-side. No API keys, no secrets. Banksia Invest and Wattle Minerals are fictional; all prices, index values and business figures are simulated and are not market data.

Product background: Tako Search on the Vercel AI Gateway (announced 23 Oct 2026), https://docs.tako.com/documentation/integrations/vercel-ai-gateway

```bash
npm install
npm run dev
```
