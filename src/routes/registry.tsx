import { createSignal, createResource, Show } from "solid-js";
import { SearchTree } from "~/components/SearchTree";
import { ExtensionPanel } from "~/components/ExtensionPanel";
import { searchExtensions } from "~/lib/registry/search";
import { resolveDependencyTree } from "~/lib/registry/analyzer";
import { server$ } from "@solidjs/start/server";

const searchAction = server$(async (query: string) => {
    if (query.length < 2) return [];
    return await searchExtensions(query);
});

const resolveDepsAction = server$(async (id: string) => {
    return await resolveDependencyTree(id, 1);
});

export default function Registry() {
    const [query, setQuery] = createSignal("");
    const [selectedId, setSelectedId] = createSignal<string | null>(null);

    const [results] = createResource(query, async (q) => {
        return await searchAction(q);
    });

    const [depTree] = createResource(selectedId, async (id) => {
        if (!id) return null;
        return await resolveDepsAction(id);
    });

    const selectedExtension = () => {
        const id = selectedId();
        if (!id) return null;
        return results()?.find(r => r.id === id) || results()?.flatMap(r => r.children).find(r => r.id === id) || null;
    };

    return (
        <div class="min-h-screen bg-background p-8 pb-32">
            <div class="max-w-5xl mx-auto space-y-12 mt-12">
                <header class="text-center space-y-6">
                    <div class="inline-block px-4 py-1.5 rounded-full glass border border-white/10 text-[10px] font-bold tracking-[0.3em] text-indigo-400 uppercase">
                        Official Registry
                    </div>
                    <h1 class="text-6xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                        ANTORA <span class="bg-clip-text text-transparent premium-gradient">EXTENSIONS</span>
                    </h1>
                    <p class="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        The central hub for Antora extensions and bundles. Discover, analyze, and integrate with confidence.
                    </p>
                </header>

                <section class="max-w-2xl mx-auto">
                    <div class="relative group">
                        <div class="absolute -inset-1 premium-gradient rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                        <input
                            type="text"
                            placeholder="Search extensions, bundles, or keywords..."
                            class="relative w-full px-8 py-5 bg-black rounded-2xl border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-xl font-medium shadow-2xl"
                            onInput={(e) => setQuery(e.currentTarget.value)}
                        />
                        <div class="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </section>

                <section class="mx-auto">
                    <Show when={results() && results()!.length > 0} fallback={
                        <div class="flex flex-col items-center justify-center py-32 text-center space-y-4">
                            <div class="p-6 rounded-full glass border border-white/5 text-muted-foreground/20">
                                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                            </div>
                            <div class="text-muted-foreground italic font-medium">
                                {query().length < 2 ? 'Start typing to explore the registry...' : 'No extensions found matching your search.'}
                            </div>
                        </div>
                    }>
                        <div class="grid gap-4">
                            <SearchTree results={results()!} onSelect={setSelectedId} />
                        </div>
                    </Show>
                </section>
            </div>

            <ExtensionPanel
                extension={selectedExtension()}
                isOpen={selectedId() !== null}
                onClose={() => setSelectedId(null)}
                dependencyTree={depTree()}
                onAnalyzeFull={() => {/* Full analysis logic */ }}
            />
        </div>
    );
}
