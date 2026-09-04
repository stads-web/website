import { marked } from "marked";

export default function LegalPage({
  title,
  markdownBody,
}: {
  title: string;
  markdownBody: string;
}) {
  const html = marked.parse(markdownBody, { async: false }) as string;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
      <h1 className="text-3xl font-semibold text-brand-900 sm:text-4xl">
        {title}
      </h1>
      <div
        className="prose prose-neutral mt-8 max-w-none prose-headings:text-brand-900 prose-a:text-brand-600"
        // Content comes from our own trusted markdown files in /content, not user input.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
