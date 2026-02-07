import { db } from "~/server/db";
import { extensions, dependencies } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export interface DependencyNode {
    id: string;
    name: string;
    version?: string;
    isExternal: boolean;
    dependencyCount: number;
    dependencies: DependencyNode[];
}

export async function resolveDependencyTree(extensionId: string, depth = 1): Promise<DependencyNode | null> {
    const [ext] = await db.select().from(extensions).where(eq(extensions.id, extensionId));

    if (!ext) return null;

    const deps = await db.select().from(dependencies).where(eq(dependencies.sourceId, ext.id));

    const node: DependencyNode = {
        id: ext.id,
        name: ext.name,
        version: ext.version,
        isExternal: false,
        dependencyCount: deps.length,
        dependencies: [],
    };

    if (depth > 0) {
        for (const dep of deps) {
            if (dep.targetId) {
                const child = await resolveDependencyTree(dep.targetId, depth - 1);
                if (child) {
                    node.dependencies.push(child);
                }
            } else {
                // External dependency
                node.dependencies.push({
                    id: dep.id,
                    name: dep.targetName,
                    version: dep.versionRange ?? undefined,
                    isExternal: true,
                    dependencyCount: 0,
                    dependencies: [],
                });
            }
        }
    }

    return node;
}
