import { Component, For, Show } from "solid-js";
import { signIn } from "start-authjs/client";

export default function SignIn() {
    const providers = [
        { id: "github", name: "GitHub" },
        { id: "gitlab", name: "GitLab" },
        { id: "google", name: "Google" },
        { id: "azure-ad", name: "Microsoft" },
        { id: "email", name: "Email Address" },
    ];

    return (
        <div class="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-purple-500/30">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>
                <div class="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" style={{ "animation-delay": "2s" }}></div>
            </div>

            <div class="relative w-full max-w-sm space-y-10 animate-in">
                <div class="text-center space-y-4">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-2 shadow-2xl backdrop-blur-xl">
                        <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <h1 class="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
                        <p class="text-sm text-muted-foreground/70 font-medium">Choose a secure method to continue</p>
                    </div>
                </div>

                <div class="grid gap-3">
                    <For each={providers}>
                        {(provider) => (
                            <button
                                onClick={() => signIn(provider.id)}
                                class="w-full flex items-center justify-between px-6 py-4.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/[0.05] hover:border-white/10 group shadow-lg backdrop-blur-md active:scale-[0.98]"
                            >
                                <div class="flex items-center gap-4">
                                    <ProviderIcon type={provider.id} />
                                    <span class="font-bold text-sm text-white/90 group-hover:text-white transition-colors">{provider.name}</span>
                                </div>
                                <div class="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </For>
                </div>

                <div class="pt-4">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="h-px flex-1 bg-white/5"></div>
                        <span class="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Secured with Auth.js</span>
                        <div class="h-px flex-1 bg-white/5"></div>
                    </div>
                    <p class="text-[10px] text-center text-muted-foreground/50 leading-relaxed px-8">
                        By signing in, you agree to our Terms of Service and Privacy Policy regarding extension contributions.
                    </p>
                </div>
            </div>
        </div>
    );
}

const ProviderIcon: Component<{ type: string }> = (props) => {
    return (
        <div class="w-5 h-5 flex items-center justify-center">
            <Show when={props.type === 'github'}>
                <svg fill="currentColor" viewBox="0 0 24 24" class="text-white"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.981-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </Show>
            <Show when={props.type === 'gitlab'}>
                <svg fill="currentColor" viewBox="0 0 24 24" class="text-orange-500"><path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.417-.724-.417-.859 0L16.425 9.452H7.575L4.91 1.263c-.135-.417-.724-.417-.859 0L1.387 9.452.045 13.587c-.114.352.016.737.322.959l11.633 8.419 11.633-8.419c.306-.222.436-.607.322-.959z" /></svg>
            </Show>
            <Show when={props.type === 'google'}>
                <svg fill="currentColor" viewBox="0 0 24 24" class="text-red-500"><path d="M12.48 10.92V14.4h6.44c-.2 1.39-1.39 3.06-4.44 3.06-2.67 0-4.84-2.22-4.84-4.97s2.17-4.97 4.84-4.97c1.51 0 2.53.64 3.11 1.2l2.76-2.76c-1.78-1.66-4.08-2.67-5.87-2.67-5.33 0-9.66 4.33-9.66 9.66s4.33 9.66 9.66 9.66c5.57 0 9.27-3.91 9.27-9.44 0-.63-.07-1.11-.15-1.59h-9.11z" /></svg>
            </Show>
            <Show when={props.type === 'azure-ad'}>
                <svg fill="currentColor" viewBox="0 0 24 24" class="text-blue-500"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" /></svg>
            </Show>
            <Show when={props.type === 'email'}>
                <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-emerald-400"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </Show>
        </div>
    );
};
