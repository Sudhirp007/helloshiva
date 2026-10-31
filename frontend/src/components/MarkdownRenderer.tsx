"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Quote,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

interface Block {
  type:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "hr"
    | "blockquote"
    | "code"
    | "ul"
    | "ol"
    | "image"
    | "faq_group"
    | "p";
  content?: string;
  items?: string[];
  lang?: string;
  alt?: string;
  src?: string;
  caption?: string;
  faqs?: { question: string; answer: string }[];
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content || typeof content !== "string") return null;

  const blocks = parseMarkdownToBlocks(content);

  return (
    <div className="space-y-6 text-[#10183A] leading-relaxed font-sans text-sm">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={idx}
                className="text-2xl sm:text-3xl font-black text-[#10183A] tracking-tight mt-8 mb-4 border-b border-[#E6E7F0] pb-3"
              >
                {renderInline(block.content || "")}
              </h1>
            );

          case "h2":
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-extrabold text-[#10183A] tracking-tight mt-10 mb-3 pt-4 border-t border-[#F5F4FF]"
              >
                {renderInline(block.content || "")}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={idx}
                className="text-base sm:text-lg font-bold text-[#10183A] mt-6 mb-2"
              >
                {renderInline(block.content || "")}
              </h3>
            );

          case "h4":
            return (
              <h4
                key={idx}
                className="text-sm font-bold text-[#10183A] mt-4 mb-1"
              >
                {renderInline(block.content || "")}
              </h4>
            );

          case "hr":
            return <hr key={idx} className="my-8 border-t border-[#E6E7F0]" />;

          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="my-6 p-5 sm:p-6 rounded-2xl bg-[#F5F4FF] border-l-4 border-[#6366F1] text-xs sm:text-sm text-[#10183A] shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5 opacity-80" />
                  <div className="whitespace-pre-line leading-relaxed flex-1">
                    {renderInline(block.content || "")}
                  </div>
                </div>
              </blockquote>
            );

          case "code":
            return (
              <div
                key={idx}
                className="my-6 rounded-2xl bg-[#0B1025] text-[#C6C9DC] p-5 font-mono text-xs overflow-x-auto border border-[#252B49]"
              >
                <pre className="whitespace-pre leading-relaxed">{block.content}</pre>
              </div>
            );

          case "ul":
            return (
              <ul
                key={idx}
                className="space-y-2.5 my-4 list-disc list-inside text-xs sm:text-sm text-[#333E63]"
              >
                {block.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );

          case "ol":
            return (
              <ol
                key={idx}
                className="space-y-2.5 my-4 list-decimal list-inside text-xs sm:text-sm text-[#333E63]"
              >
                {block.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );

          case "image":
            return (
              <figure key={idx} className="my-8 space-y-2">
                <div className="rounded-2xl overflow-hidden border border-[#E6E7F0] shadow-sm bg-[#F5F4FF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.src}
                    alt={block.alt || "Article graphic"}
                    className="w-full h-auto object-cover max-h-[500px]"
                    loading="lazy"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-[11px] text-[#626985] italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "faq_group":
            return <FaqAccordionGroup key={idx} faqs={block.faqs || []} />;

          case "p":
          default:
            return (
              <p
                key={idx}
                className="text-xs sm:text-sm text-[#333E63] leading-relaxed my-3 font-normal"
              >
                {renderInline(block.content || "")}
              </p>
            );
        }
      })}
    </div>
  );
}

/**
 * Interactive Accordion component for FAQ blocks ensuring crisp separation
 * between Question and Answer.
 */
function FaqAccordionGroup({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // First 2 open by default

  const toggle = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="pt-8 mt-10 border-t border-[#E6E7F0] space-y-4">
      <div className="space-y-1 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#10183A] tracking-tight">
          Executive Insights & Common Queries
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8E7FF] bg-white shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 bg-[#FAF9FF] hover:bg-[#F5F4FF] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-[#6366F1] text-white flex items-center justify-center font-extrabold text-xs mt-0.5 shadow-xs">
                    Q
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#10183A] leading-snug">
                    {faq.question}
                  </span>
                </div>
                <span className="shrink-0 text-[#6366F1] mt-0.5">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 pt-3 sm:pt-4 bg-white border-t border-[#E8E7FF]/60 text-xs sm:text-sm text-[#333E63] leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-[#E8E7FF] text-[#6366F1] flex items-center justify-center font-extrabold text-xs mt-0.5">
                      A
                    </span>
                    <div className="flex-1 space-y-2">
                      {renderInline(faq.answer)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Robust line-by-line finite state parser that converts raw markdown text into
 * structured semantic blocks without losing single-line headings or dividers.
 */
function parseMarkdownToBlocks(text: string): Block[] {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const lines = clean.split("\n");
  const blocks: Block[] = [];

  let inFaqSection = false;
  let currentFaqs: { question: string; answer: string }[] = [];
  let pendingFaqQuestion: string | null = null;
  let pendingFaqAnswerLines: string[] = [];

  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];

  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      const pText = paragraphLines.join(" ").trim();
      if (pText) {
        if (inFaqSection && pendingFaqQuestion) {
          pendingFaqAnswerLines.push(pText);
        } else {
          blocks.push({ type: "p", content: pText });
        }
      }
      paragraphLines = [];
    }
  };

  const flushFaqQuestion = () => {
    if (pendingFaqQuestion) {
      currentFaqs.push({
        question: pendingFaqQuestion,
        answer: pendingFaqAnswerLines.join("\n\n").trim() || "Consult HelloShiva for tailored guidance on this topic.",
      });
      pendingFaqQuestion = null;
      pendingFaqAnswerLines = [];
    }
  };

  const flushFaqGroup = () => {
    flushFaqQuestion();
    if (currentFaqs.length > 0) {
      blocks.push({ type: "faq_group", faqs: [...currentFaqs] });
      currentFaqs = [];
    }
    inFaqSection = false;
  };

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      blocks.push({ type: listType, items: [...listItems] });
      listItems = [];
      listType = null;
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      blocks.push({ type: "blockquote", content: blockquoteLines.join("\n").trim() });
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const flushCodeBlock = () => {
    if (codeLines.length > 0) {
      blocks.push({ type: "code", content: codeLines.join("\n"), lang: codeLang });
      codeLines = [];
      codeLang = "";
      inCodeBlock = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Block boundary
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushParagraph();
        flushList();
        flushBlockquote();
        inCodeBlock = true;
        codeLang = line.replace(/^```/, "").trim();
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    // 2. Blank line
    if (!line) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    // 3. Horizontal Divider (--- or *** or ___)
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      flushList();
      flushBlockquote();
      if (inFaqSection) flushFaqGroup();
      blocks.push({ type: "hr" });
      continue;
    }

    // 4. Headings
    if (/^#{1,4}\s+/.test(line)) {
      flushParagraph();
      flushList();
      flushBlockquote();

      const levelMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (levelMatch) {
        const hashes = levelMatch[1];
        const headingText = levelMatch[2].trim();

        // Check if this starts the FAQ section
        if (/frequently asked questions|faq/i.test(headingText)) {
          if (inFaqSection) flushFaqGroup();
          inFaqSection = true;
          continue;
        }

        // If inside FAQ section and this is an H3 or H4 or starts with "Why", "How", "What", treat as Question!
        if (inFaqSection && (hashes === "###" || hashes === "####" || headingText.endsWith("?"))) {
          flushFaqQuestion();
          pendingFaqQuestion = headingText.replace(/^\d+[\.\)]\s*/, "").trim();
          continue;
        }

        // Otherwise, any standard H1, H2, H3 heading leaves the FAQ section
        if (inFaqSection && (hashes === "#" || hashes === "##")) {
          flushFaqGroup();
        }

        if (hashes === "#") {
          blocks.push({ type: "h1", content: headingText });
        } else if (hashes === "##") {
          blocks.push({ type: "h2", content: headingText });
        } else if (hashes === "###") {
          blocks.push({ type: "h3", content: headingText });
        } else {
          blocks.push({ type: "h4", content: headingText });
        }
        continue;
      }
    }

    // 5. Image: ![alt](src "caption")
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
    if (imgMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      blocks.push({
        type: "image",
        alt: imgMatch[1],
        src: imgMatch[2],
        caption: imgMatch[3] || imgMatch[1],
      });
      continue;
    }

    // 6. Blockquote (> line)
    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      inBlockquote = true;
      blockquoteLines.push(line.replace(/^>\s*/, ""));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // 7. Unordered list (- or * item)
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushBlockquote();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // 8. Ordered list (1. item)
    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      flushBlockquote();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    // If we were in a list and this is not a list item, flush list
    if (listType) {
      flushList();
    }

    // 9. If inside FAQ section, parse questions & answers flexibly
    if (inFaqSection) {
      // Catch questions formatted as **What is ...?** with optional inline answer
      const boldQMatch = line.match(/^\*{2,3}(?:Q:?\s*)?([^*?]+\?)\*{2,3}(?:\s*(.*))?$/);
      if (boldQMatch) {
        flushFaqQuestion();
        pendingFaqQuestion = boldQMatch[1].trim();
        if (boldQMatch[2]) {
          pendingFaqAnswerLines.push(boldQMatch[2].trim());
        }
        continue;
      }

      // Catch standalone question line ending with ? if no question is currently pending
      if (line.endsWith("?") && line.length < 140 && !pendingFaqQuestion) {
        flushFaqQuestion();
        pendingFaqQuestion = line.replace(/^\d+[\.\)]\s*/, "").replace(/^Q:\s*/i, "").trim();
        continue;
      }

      if (pendingFaqQuestion) {
        pendingFaqAnswerLines.push(line);
        continue;
      }
    }

    // 10. Normal paragraph text
    paragraphLines.push(line);
  }

  // Final flushes
  flushParagraph();
  flushList();
  flushBlockquote();
  flushCodeBlock();
  if (inFaqSection) {
    flushFaqGroup();
  }

  return blocks;
}

/**
 * Inline formatter for links, bold, italic, and code.
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return "";

  // 1. Links: [label](url)
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseFormatting(text.substring(lastIndex, match.index)));
    }
    const label = match[1];
    const url = match[2];

    if (url.startsWith("/")) {
      parts.push(
        <Link
          key={match.index}
          href={url}
          className="text-[#6366F1] font-semibold hover:underline decoration-indigo-400"
        >
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6366F1] font-semibold hover:underline decoration-indigo-400 inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
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
  // Bold: **text** or __text__
  const boldRegex = /(\*\*|__)(.*?)\1/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseItalicAndCode(text.substring(lastIndex, match.index)));
    }
    parts.push(
      <strong key={match.index} className="font-bold text-[#10183A]">
        {match[2]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(parseItalicAndCode(text.substring(lastIndex)));
  }

  return parts;
}

function parseItalicAndCode(text: string): React.ReactNode {
  // Code: `code`
  const codeRegex = /`([^`]+)`/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseItalicOnly(text.substring(lastIndex, match.index)));
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
    parts.push(parseItalicOnly(text.substring(lastIndex)));
  }

  return parts;
}

function parseItalicOnly(text: string): React.ReactNode {
  // Italic: *text* or _text_
  const italicRegex = /(\*|_)(.*?)\1/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = italicRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <em key={match.index} className="italic text-[#333E63]">
        {match[2]}
      </em>
    );
    lastIndex = italicRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
