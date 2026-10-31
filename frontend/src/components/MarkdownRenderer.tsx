import React from "react";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by double newlines into blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6 text-[#10183A] leading-relaxed font-sans">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // 1. Horizontal Rule (---)
        if (trimmed === "---") {
          return <hr key={idx} className="my-8 border-t border-[#E6E7F0]" />;
        }

        // 2. Heading 1 (# Heading)
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-2xl sm:text-3xl font-black text-[#10183A] tracking-tight mt-8 mb-4">
              {renderInline(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        // 3. Heading 2 (## Heading)
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-[#10183A] tracking-tight mt-10 mb-3 pt-4 border-t border-[#F5F4FF]">
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // 4. Heading 3 (### Heading)
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-lg font-bold text-[#10183A] mt-6 mb-2">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // 5. Blockquote (> quote)
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed
            .split("\n")
            .map((line) => line.replace(/^>\s*/, ""))
            .join("\n");
          return (
            <blockquote
              key={idx}
              className="my-6 p-5 rounded-2xl bg-[#F5F4FF] border-l-4 border-[#6366F1] text-xs sm:text-sm text-[#10183A] shadow-xs"
            >
              <div className="whitespace-pre-line">{renderInline(quoteLines)}</div>
            </blockquote>
          );
        }

        // 6. Code Block (```code```)
        if (trimmed.startsWith("```")) {
          const codeLines = trimmed.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "");
          return (
            <div key={idx} className="my-6 rounded-2xl bg-[#0B1025] text-[#C6C9DC] p-5 font-mono text-xs overflow-x-auto border border-[#252B49]">
              <pre className="whitespace-pre leading-relaxed">{codeLines}</pre>
            </div>
          );
        }

        // 7. Bullet List (- item or * item)
        if (/^[-*]\s+/m.test(trimmed)) {
          const items = trimmed.split("\n").filter((line) => /^[-*]\s+/.test(line));
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

        // 8. Numbered List (1. item)
        if (/^\d+\.\s+/m.test(trimmed)) {
          const items = trimmed.split("\n").filter((line) => /^\d+\.\s+/.test(line));
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

        // 9. Standard Paragraph
        return (
          <p key={idx} className="text-xs sm:text-sm text-[#333E63] leading-relaxed my-3">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Inline renderer for **bold**, *italic*, `code`, and [link](url)
function renderInline(text: string): React.ReactNode {
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
  // Quick bold parse: **text**
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
