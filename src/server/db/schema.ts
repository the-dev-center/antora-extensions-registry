import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
});

export const accounts = sqliteTable("account", {
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (table) => ({
    compoundKey: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
    compositePk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// Extension Registry Tables
export const extensions = sqliteTable("extension", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(), // e.g., "@antora/my-ext"
    description: text("description"),
    version: text("version").notNull(),
    type: text("type").notNull(), // "extension" | "bundle"
    authorId: text("authorId").references(() => users.id),
    repositoryUrl: text("repositoryUrl"),
    npmName: text("npmName"),
    readme: text("readme"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const bundleMembers = sqliteTable("bundle_member", {
    bundleId: text("bundleId").notNull().references(() => extensions.id, { onDelete: "cascade" }),
    extensionId: text("extensionId").notNull().references(() => extensions.id, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.bundleId, table.extensionId] }),
}));

export const dependencies = sqliteTable("dependency", {
    id: text("id").primaryKey(),
    sourceId: text("sourceId").notNull().references(() => extensions.id, { onDelete: "cascade" }),
    targetName: text("targetName").notNull(),
    targetId: text("targetId").references(() => extensions.id),
    versionRange: text("versionRange"),
    isNative: integer("isNative", { mode: "boolean" }).default(false).notNull(),
});

export const screenshots = sqliteTable("screenshot", {
    id: text("id").primaryKey(),
    extensionId: text("extensionId").notNull().references(() => extensions.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption"),
    order: integer("order").default(0).notNull(),
});
