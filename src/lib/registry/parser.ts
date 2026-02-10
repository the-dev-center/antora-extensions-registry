import asciidoctor from '@asciidoctor/core';
import matter from 'gray-matter';

const adoc = asciidoctor();

export interface ExtensionDoc {
    name: string;
    description?: string;
    screenshots?: { url: string; caption?: string }[];
    contentHtml: string;
}

export function parseExtensionDoc(content: string): ExtensionDoc {
    // 1. Extract frontmatter
    const { data, content: adocContent } = matter(content);

    // 2. Convert AsciiDoc to HTML
    // We use 'safe' mode to prevent arbitrary file inclusion and other security risks
    // We use the 'showtitle' attribute to ensure the title is rendered if present
    const contentHtml = adoc.convert(adocContent, {
        safe: 'secure',
        attributes: {
            showtitle: true,
            'source-highlighter': 'highlightjs',
        }
    }) as string;

    return {
        name: data.name || '',
        description: data.description,
        screenshots: data.screenshots,
        contentHtml,
    };
}
