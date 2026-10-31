import React from "react";
import Link from "next/link";
import { HelpCircle, CheckCircle2, Sparkles, Image as ImageIcon } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // 1. Preprocess: Ensure headings (#, ##, ###) always stand on their own lines with double linebreaks
  // This prevents question headings from swallowing subsequent answer paragraphs!
  let normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/\n(#{1,4}\s+[^\n]+)\n([^\n#])/g, "\n\n$1\n\n$2")
    .replace(/^([^\n#]+)\n(#{1,4}\s+[^\n]+)/gm, "$1\n\n$2");

  // Split into separate semantic blocks
  const rawBlocks = normalized.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  // Group blocks: detect FAQ section and format question/answer cards distinctly
  let inFaqSection = false;

  return (
    <div className="space-y-6 text-[#10183A] leading-relaxed font-sans">
      {rawBlocks.map((block, idx) => {
        // 1. Horizontal Divider (--- or ***)
        if (block === "---" || block === "***") {
          inFaqSection = false;
          return <hr key={idx} className="my-8 border-t border-[#E6E7F0]" />;
        }

        // 2. Heading 1 (# Heading)
        if (block.startsWith("# ")) {
          inFaqSection = false;
          const text = block.replace(/^#\s+/, "").trim();
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-black text-[#10183A] tracking-tight mt-8 mb-4">
              {renderInline(text)}
            </h1>
          );
        }

        // 3. Heading 2 (## Heading)
        if (block.startsWith("## ")) {
          const text = block.replace(/^##\s+/, "").trim();
          if (/frequently asked questions|faq/i.test(text)) {
            inFaqSection = true;
            return (
              <div key={idx} className="pt-8 mt-10 border-t border-[#E6E7F0] space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10183A] tracking-tight">
                  {renderInline(text)}
                </h2>
              </div>
            );
          } else {
            inFaqSection = false;
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-extrabold text-[#10183A] tracking-tight mt-10 mb-3 pt-4 border-t border-[#F5F4FF]"
              >
                {renderInline(text)}
              </h2>
            );
          }
        }

        // 4. Heading 3 (### Heading)
        if (block.startsWith("### ")) {
          const lines = block.split("\n");
          const questionText = lines[0].replace(/^###\s+/, "").trim();
          const subsequentText = lines.slice(1).join("\n").trim();

          // If inside FAQ section, render as a distinct Question card!
          if (inFaqSection) {
            return (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-3 my-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs mt-0.5 shadow-xs">
                    Q
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#10183A] leading-snug">
                    {renderInline(questionText)}
                  </h3>
                </div>
                {subsequentText && (
                  <div className="pl-9 text-xs sm:text-sm text-[#333E63] leading-relaxed pt-1 border-t border-[#E8E7FF]/60">
                    {renderInline(subsequentText)}
                  </div>
                )}
              </div>
            );
          }

          // Normal H3
          return (
            <div key={idx} className="mt-6 mb-2 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-[#10183A]">
                {renderInline(questionText)}
              </h3>
              {subsequentText && (
                <p className="text-xs sm:text-sm text-[#333E63] leading-relaxed">
                  {renderInline(subsequentText)}
                </p>
              )}
            </div>
          );
        }

        // 5. Image: ![alt](url "optional caption")
        const imgMatch = block.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          const caption = imgMatch[3] || alt;
          return (
            <figure key={idx} className="my-8 space-y-2">
              <div className="rounded-2xl overflow-hidden border border-[#E6E7F0] shadow-sm bg-[#F5F4FF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-auto object-cover max-h-[500px]"
                  loading="lazy"
                />
              </div>
              {caption && (
                <figcaption className="text-center text-[11px] text-[#626985] italic">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // 6. Blockquote or Agency Callout (> quote)
        if (block.startsWith("> ")) {
          const quoteLines = block
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join("\n");
          return (
            <blockquote
              key={idx}
              className="my-6 p-5 sm:p-6 rounded-2xl bg-[#F5F4FF] border-l-4 border-[#6366F1] text-xs sm:text-sm text-[#10183A] shadow-xs"
            >
              <div className="whitespace-pre-line leading-relaxed">{renderInline(quoteLines)}</div>
            </blockquote>
          );
        }

        // 7. Code Block (```code```)
        if (block.startsWith("```")) {
          const codeLines = block.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "");
          return (
            <div
              key={idx}
              className="my-6 rounded-2xl bg-[#0B1025] text-[#C6C9DC] p-5 font-mono text-xs overflow-x-auto border border-[#252B49]"
            >
              <pre className="whitespace-pre leading-relaxed">{codeLines}</pre>
            </div>
          );
        }

        // 8. Bullet List (- item or * item)
        if (/^[-*]\s+/m.test(block)) {
          const items = block.split("\n").filter((line) => /^[-*]\s+/.test(line));
          return (
            <ul key={idx} className="space-y-2.5 my-4 list-disc list-inside text-xs sm:text-sm text-[#333E63]">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // 9. Numbered List (1. item)
        if (/^\d+\.\s+/m.test(block)) {
          const items = block.split("\n").filter((line) => /^\d+\.\s+/.test(line));
          return (
            <ol key={idx} className="space-y-2.5 my-4 list-decimal list-inside text-xs sm:text-sm text-[#333E63]">
              {items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // 10. If this is an answer paragraph under FAQ section
        if (inFaqSection) {
          return (
            <div key={idx} className="p-4 rounded-xl bg-white border border-[#E8E7FF] text-xs sm:text-sm text-[#333E63] my-2 shadow-xs">
              {renderInline(block)}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-[#333E63] leading-relaxed my-3 font-normal">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

// Inline renderer for **bold**, *italic*, `code`, and [link](url)
function renderInline(text: string): React.ReactNode {
  if (!text) return "";

  // Pattern to match links [text](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormatting(text.substring(lastIndex, match.index)));
    }
    const linkText = match[1];
    const linkUrl = match[2];

    const isInternal = linkUrl.startsWith("/");
    if (isInternal) {
      parts.push(
        <Link
          key={match.index}
          href={linkUrl}
          className="text-[#6366F1] font-semibold hover:underline decoration-indigo-400"
        >
          {linkText}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6366F1] font-semibold hover:underline decoration-indigo-400"
        >
          {linkText}
        </a>
      );
    }
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(parseFormatting(text.substring(lastIndex)));
  }

  return <>{parts.length > 0 ? parts : parseFormatting(text)}</>;
}

function parseFormatting(text: string): React.ReactNode {
  // Bold parse: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseCodeAndItalic(text.substring(lastIndex, match.index)));
    }
    parts.push(
      <strong key={match.index} className="font-bold text-[#10183A]">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(parseCodeAndItalic(text.substring(lastIndex)));
  }

  return parts;
}

function parseCodeAndItalic(text: string): React.ReactNode {
  // Inline code `text`
  const codeRegex = /`([^`]+)`/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <code
        key={match.index}
        className="px-1.5 py-0.5 rounded bg-[#F5F4FF] text-[#6366F1] font-mono text-[11px] border border-[#E8E7FF]"
      >
        {match[1]}
      </code>
    );
    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
