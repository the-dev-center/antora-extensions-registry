import type { Component } from "solid-js";

export const DependencyButton: Component<{ count: number; onClick: () => void }> = (props) => {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); props.onClick(); }}
            class="px-2.5 py-1 text-[10px] font-bold rounded-full glass hover:bg-foreground/10 transition-colors flex items-center gap-1.5 text-muted-foreground hover:text-foreground border border-border"
            title={`${props.count} dependencies`}
        >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {props.count}
        </button>
    );
};
