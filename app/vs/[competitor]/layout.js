// app/vs/[competitor]/layout.js
// Minimal layout file. Next.js 15.1.11+ requires every dynamic route segment
// to have an explicit layout. We just pass children through — the root
// layout in app/layout.js handles the actual page chrome.

export default function CompetitorLayout({ children }) {
  return children;
}
