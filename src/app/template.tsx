/**
 * Page transition (fade + slide + soft blur + slight scale) in pure CSS, so
 * server-rendered content is never hidden and crawlers / no-JS visitors see the page normally.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
