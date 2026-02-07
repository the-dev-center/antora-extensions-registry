import { db } from "~/server/db";
import { extensions, dependencies, bundleMembers } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

interface PackageJson {
    name: string;
    version: string;
    description?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    keywords?: string[];
    antora?: {
        extensions?: string[];
    };
}

const NATIVE_ANTORA_PACKAGES = [
    "@antora/cli",
    "@antora/site-generator",
    "@antora/asciidoc-loader",
    "@antora/content-aggregator",
    "@antora/content-classifier",
    "@antora/document-converter",
    "@antora/navigation-builder",
    "@antora/page-composer",
    "@antora/redirect-producer",
    "@antora/site-mapper",
    "@antora/site-publisher",
    "@antora/ui-loader",
];

export async function indexExtension(
    pkg: PackageJson,
    type: "extension" | "bundle" = "extension",
    authorId?: string,
    repositoryUrl?: string
) {
    const extensionId = uuidv4();

    // 1. Insert/Update Extension
    await db.insert(extensions).values({
        id: extensionId,
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        type,
        authorId,
        repositoryUrl,
        npmName: pkg.name,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).onConflictDoUpdate({
        target: extensions.name,
        set: {
            version: pkg.version,
            description: pkg.description,
            updatedAt: new Date(),
        },
    });

    // 2. Clear old dependencies
    const [existing] = await db.select().from(extensions).where(eq(extensions.name, pkg.name));
    if (existing) {
        await db.delete(dependencies).where(eq(dependencies.sourceId, existing.id));
    }

    // 3. Analyze dependencies
    const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
    };

    const depRecords = Object.entries(allDeps)
        .filter(([name]) => !NATIVE_ANTORA_PACKAGES.includes(name))
        .map(([name, range]) => ({
            id: uuidv4(),
            sourceId: extensionId,
            targetName: name,
            versionRange: range,
            isNative: false, // We filtered them out, but could flag them instead
        }));

    if (depRecords.length > 0) {
        await db.insert(dependencies).values(depRecords);
    }

    return extensionId;
}

export async function indexBundle(pkg: PackageJson, memberPkgs: PackageJson[], authorId?: string) {
    const bundleId = await indexExtension(pkg, "bundle", authorId);

    for (const member of memberPkgs) {
        const extensionId = await indexExtension(member, "extension", authorId);

        await db.insert(bundleMembers).values({
            bundleId,
            extensionId,
        }).onConflictDoNothing();
    }

    return bundleId;
}
