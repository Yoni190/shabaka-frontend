import type { ComponentType, ReactNode } from "react";

interface PlaceholderPanelProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  /** Optional secondary paragraph, e.g. a note about the missing API. */
  note?: ReactNode;
}

export default function PlaceholderPanel({
  icon: Icon,
  title,
  description,
  note,
}: PlaceholderPanelProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
      {note && (
        <p className="mx-auto mt-3 max-w-md text-xs text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
}