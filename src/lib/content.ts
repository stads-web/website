import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Reads a markdown file's frontmatter + body ("data" and "content").
 * Used to load editable site copy from /content without a database or CMS backend -
 * board members can edit these .md files directly on GitHub.
 */
export function readContent<T = Record<string, unknown>>(relativePath: string) {
  const fullPath = path.join(CONTENT_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { data: data as T, content, paragraphs };
}
