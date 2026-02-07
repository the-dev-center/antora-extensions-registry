import { db } from "~/server/db";
import { extensions, bundleMembers, dependencies } from "~/server/db/schema";
import { eq, like, or, sql } from "drizzle-orm";

export interface SearchResult {
    id: string;
    name: string;
    description: string | null;
    version: string;
    type: string;
    dependencyCount: number;
    children: SearchResult[];
}

export async function searchExtensions(query: string): Promise<SearchResult[]> {
    const matches = await db.select({
        id: extensions.id,
        name: extensions.name,
        description: extensions.description,
        version: extensions.version,
        type: extensions.type,
    })
        .from(extensions)
        .where(
            or(
                like(extensions.name, `%${query}%`),
                like(extensions.description, `%${query}%`)
            )
        );

    const results: SearchResult[] = [];
    const processedIds = new Set<string>();

    for (const match of matches) {
        if (processedIds.has(match.id)) continue;

        // Get dependency count
        const [depCount] = await db.select({ count: sql`count(*)` })
            .from(dependencies)
            .where(eq(dependencies.sourceId, match.id));

        const resultNode: SearchResult = {
            ...match,
            dependencyCount: Number(depCount?.count ?? 0),
            children: [],
        };

        // Check if this extension is part of a bundle
        const [membership] = await db.select()
            .from(bundleMembers)
            .where(eq(bundleMembers.extensionId, match.id));

        if (membership) {
            const [bundle] = await db.select({
                id: extensions.id,
                name: extensions.name,
                description: extensions.description,
                version: extensions.version,
                type: extensions.type,
            })
                .from(extensions)
                .where(eq(extensions.id, membership.bundleId));

            if (bundle) {
                let bundleNode = results.find(r => r.id === bundle.id);
                if (!bundleNode) {
                    const [bundleDepCount] = await db.select({ count: sql`count(*)` })
                        .from(dependencies)
                        .where(eq(dependencies.sourceId, bundle.id));

                    bundleNode = {
                        ...bundle,
                        dependencyCount: Number(bundleDepCount?.count ?? 0),
                        children: [],
                    };
                    results.push(bundleNode);
                }
                bundleNode.children.push(resultNode);
                processedIds.add(match.id);
                continue;
            }
        }

        results.push(resultNode);
        processedIds.add(match.id);
    }

    return results;
}
