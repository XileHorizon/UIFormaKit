import type { HTMLAttributes, ReactNode } from "react";
import "./layout-components.css";

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  label?: ReactNode;
  actions?: ReactNode;
  wrap?: boolean;
}

export function CodeBlock({ code, language, label, actions, wrap = false, className = "", ...props }: CodeBlockProps) {
  return (
    <div {...props} className={`uf-code-block ${className}`.trim()} data-wrap={wrap || undefined}>
      {(label || actions) && <div className="uf-code-block__toolbar"><span>{label}</span><div>{actions}</div></div>}
      <pre><code data-language={language}>{code}</code></pre>
    </div>
  );
}
