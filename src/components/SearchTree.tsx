import { Component, For, Show, createSignal } from "solid-js";
import { SearchResult } from "~/lib/registry/search";
import { DependencyButton } from "./DependencyButton";

export const SearchTree: Component<{ results: SearchResult[]; onSelect: (id: string) => void }> = (props) => {
    return (
        <div class="flex flex-col gap-2">
            <For each={props.results}>
                {(node) => <TreeNode node={node} onSelect={props.onSelect} />}
            </For>
        </div>
    );
};

const TreeNode: Component<{ node: SearchResult; onSelect: (id: string) => void }> = (props) => {
    const [expanded, setExpanded] = createSignal(true);

    return (
        <div class="animate-in">
            <div
                class="flex items-center justify-between p-4 rounded-xl glass hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/10 group"
                onClick={() => props.onSelect(props.node.id)}
            >
                <div class="flex items-center gap-3">
                    <Show when={props.node.children.length > 0}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded()); }}
                            class={`p-1 rounded-md hover:bg-white/10 transition-all duration-200 ${expanded() ? 'rotate-90' : ''}`}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </Show>
                    <div>
                        <div class="font-semibold text-white flex items-center gap-3">
                            {props.node.name}
                            <span class={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground uppercase tracking-widest ${props.node.type === 'bundle' ? 'bg-purple-500/10 text-purple-400' : ''}`}>
                                {props.node.type}
                            </span>
                        </div>
                        <Show when={props.node.description}>
                            <div class="text-xs text-muted-foreground truncate max-w-sm md:max-w-xl">
                                {props.node.description}
                            </div>
                        </Show>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <DependencyButton count={props.node.dependencyCount} onClick={() => props.onSelect(props.node.id)} />
                    <svg class="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            <Show when={expanded() && props.node.children.length > 0}>
                <div class="ml-8 mt-2 flex flex-col gap-2 border-l-2 border-white/5 pl-4 py-2">
                    <For each={props.node.children}>
                        {(child) => <TreeNode node={child} onSelect={props.onSelect} />}
                    </For>
                </div>
            </Show>
        </div>
    );
};
