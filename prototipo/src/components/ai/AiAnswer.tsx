// No viene de Figma: muestra la respuesta de la IA (PR 3, REVISION-IA.md sección 4).
// Entiende el Markdown que devuelve el modelo (párrafos, **negritas**, viñetas y listas numeradas) y nunca
// interpreta HTML: todo se pinta como texto.
import { Fragment, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { AI_TEXT } from './aiText';

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i} className="font-bold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

type Block = { kind: 'p'; lines: string[] } | { kind: 'ul' | 'ol'; items: string[] };

function blocks(markdown: string): Block[] {
  const out: Block[] = [];
  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const last = out[out.length - 1];
    if (!line.trim()) {
      out.push({ kind: 'p', lines: [] });
    } else if (bullet || numbered) {
      const kind = bullet ? 'ul' : 'ol';
      const item = (bullet ?? numbered)![1];
      if (last && last.kind === kind) last.items.push(item);
      else out.push({ kind, items: [item] });
    } else if (last && last.kind === 'p') {
      last.lines.push(line.replace(/^#+\s*/, ''));
    } else {
      out.push({ kind: 'p', lines: [line.replace(/^#+\s*/, '')] });
    }
  }
  return out.filter((b) => (b.kind === 'p' ? b.lines.length > 0 : b.items.length > 0));
}

export function AiAnswer({ text, streaming, cut, className }: { text: string; streaming?: boolean; cut?: boolean; className?: string }) {
  const list = blocks(text);
  return (
    <div className={cn('flex flex-col gap-2 font-jakarta text-[13px] leading-[1.55] text-ink', className)}>
      {list.map((b, i) => {
        const caret = streaming && i === list.length - 1;
        if (b.kind === 'p')
          return (
            <p key={i} className="whitespace-pre-wrap break-words">
              {inline(b.lines.join('\n'))}
              {caret && <Caret />}
            </p>
          );
        const Tag = b.kind;
        return (
          <Tag key={i} className={cn('flex flex-col gap-1 pl-5', b.kind === 'ul' ? 'list-disc' : 'list-decimal')}>
            {b.items.map((item, j) => (
              <li key={j} className="break-words">
                {inline(item)}
                {caret && j === b.items.length - 1 && <Caret />}
              </li>
            ))}
          </Tag>
        );
      })}
      {streaming && list.length === 0 && <Caret />}
      {cut && <p className="rounded-md bg-warning-soft px-2.5 py-1.5 text-[12px] font-semibold text-[#92400e]">{AI_TEXT.cut}</p>}
    </div>
  );
}

function Caret() {
  return <span aria-hidden="true" className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse rounded-sm bg-primary" />;
}

/** El aviso del backend, igual en todas las piezas de IA. */
export function AiDisclaimer({ text, className }: { text?: string | null; className?: string }) {
  return (
    <p role="note" className={cn('rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-2 font-jakarta text-[12px] font-medium leading-[1.45] text-[#92400e]', className)}>
      {text ?? AI_TEXT.disclaimer}
    </p>
  );
}
