import type { HTMLAttributes, ReactNode } from "react";
import "./tokens/components.css";
import "./layout-components.css";

export interface WorkbenchShellProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  navigation?: ReactNode;
  tools?: ReactNode;
}

export function WorkbenchShell({ header, navigation, tools, children, className = "", ...props }: WorkbenchShellProps) {
  return <div {...props} className={`uf-workbench ${className}`.trim()}>{header && <header className="uf-workbench__header">{header}</header>}{navigation && <nav className="uf-workbench__navigation">{navigation}</nav>}<main className="uf-workbench__main">{children}</main>{tools && <aside className="uf-workbench__tools">{tools}</aside>}</div>;
}
