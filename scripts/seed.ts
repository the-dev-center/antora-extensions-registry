import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/server/db/schema";
import { v4 as uuidv4 } from "uuid";

const client = createClient({
    url: "file:local.db",
});

const db = drizzle(client, { schema });

async function seed() {
    console.log("Seeding database...");

    const bundleId = uuidv4();
    await db.insert(schema.extensions).values({
        id: bundleId,
        name: "antora-professional-bundle",
        version: "1.0.0",
        description: "A premium bundle of essential Antora extensions for enterprise-grade documentation sites.",
        type: "bundle",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const ext1Id = uuidv4();
    await db.insert(schema.extensions).values({
        id: ext1Id,
        name: "@antora/lunr-extension",
        version: "1.1.0",
        description: "Native client-side search engine for Antora using Lunr.js",
        type: "extension",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const ext2Id = uuidv4();
    await db.insert(schema.extensions).values({
        id: ext2Id,
        name: "@asciidoctor/tabs",
        version: "2.0.0",
        description: "Add tabbed content blocks to your Antora site",
        type: "extension",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await db.insert(schema.bundleMembers).values([
        { bundleId, extensionId: ext1Id },
        { bundleId, extensionId: ext2Id },
    ]);

    await db.insert(schema.dependencies).values([
        { id: uuidv4(), sourceId: ext1Id, targetName: "lunr", versionRange: "^2.3.9" },
        { id: uuidv4(), sourceId: ext1Id, targetName: "@antora/cli", versionRange: "*", isNative: true },
        { id: uuidv4(), sourceId: ext2Id, targetName: "asciidoctor", versionRange: "^2.0.0" },
    ]);

    console.log("Seeding complete! Added bundle 'antora-professional-bundle' with 2 members.");
}

seed().catch(console.error);
