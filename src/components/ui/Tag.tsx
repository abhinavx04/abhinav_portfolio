/** Tech tag: purple outline, light label (purple text fails AA on surface, see DESIGN.md). */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-ui border border-purple px-2.5 py-1 text-ui font-semibold leading-none text-text">
      {children}
    </li>
  );
}

export function TagList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </ul>
  );
}
