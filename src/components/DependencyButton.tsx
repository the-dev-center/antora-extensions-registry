import { Component } from "solid-js";

export const DependencyButton: Component<{ count: number; onClick: () => void }> = (props) => {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); props.onClick(); }}
            class="px-2 py-1 text-xs rounded-full glass hover:bg-white/10 transition-colors flex items-center gap-1 text-muted-foreground hover:text-white"
            title={`${props.count} dependencies`}
        >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {props.count}
        </button>
    );
};
