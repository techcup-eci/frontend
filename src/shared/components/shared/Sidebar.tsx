import { Link, useLocation } from "react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
}

export default function Sidebar({ sections }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="space-y-6 p-4">
        {sections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="mb-3 px-3 text-xs font-bold uppercase text-muted-foreground">
                {section.title}
              </h3>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
