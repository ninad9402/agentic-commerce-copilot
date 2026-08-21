import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GrowthCopilot.ai | Autonomous Agentic Commerce Copilot',
  description: 'AI Agent for e-commerce brands that turns store data into prioritized growth experiments, autonomous campaign assets, human-in-the-loop approvals, and closed-loop learning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
