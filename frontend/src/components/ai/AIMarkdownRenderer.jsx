import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const CodeBlock = ({ children, className, isDark }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') ?? 'text';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-white/8">
      <div
        className={`flex items-center justify-between px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
          isDark
            ? 'bg-[#1a2a3a] text-sky-400/70 border-b border-white/8'
            : 'bg-slate-100 text-slate-500 border-b border-slate-200'
        }`}
      >
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
            isDark
              ? 'hover:bg-white/10 text-sky-400/60 hover:text-sky-300'
              : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check size={11} /> Copied
            </>
          ) : (
            <>
              <Copy size={11} /> Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.78rem',
          lineHeight: '1.6',
          background: isDark ? '#0d1b2a' : '#f8fafc',
          padding: '1rem',
        }}
        codeTagProps={{
          style: { fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const AIMarkdownRenderer = ({ content }) => {
  const { isDark } = useTheme();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        pre({ children }) {
          return <>{children}</>;
        },
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith('language-');
          if (isBlock) {
            return (
              <CodeBlock className={className} isDark={isDark}>
                {children}
              </CodeBlock>
            );
          }
          return (
            <code
              className={`rounded-md px-1.5 py-0.5 text-[0.8em] font-mono ${
                isDark
                  ? 'bg-sky-900/40 text-sky-300 border border-sky-500/20'
                  : 'bg-sky-100 text-sky-700 border border-sky-200'
              }`}
              {...props}
            >
              {children}
            </code>
          );
        },

        h1: ({ children }) => (
          <h1 className={`mb-2 mt-4 text-base font-black tracking-tight ${isDark ? 'text-sky-200' : 'text-sky-950'}`}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className={`mb-2 mt-3 text-sm font-black ${isDark ? 'text-sky-300' : 'text-sky-900'}`}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={`mb-1.5 mt-2.5 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-950'}`}>
            {children}
          </h3>
        ),

        p: ({ children }) => (
          <p className={`mb-2.5 leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-950 font-medium'}`}>
            {children}
          </p>
        ),

        strong: ({ children }) => (
          <strong className={`font-black ${isDark ? 'text-white' : 'text-black'}`}>
            {children}
          </strong>
        ),

        em: ({ children }) => (
          <em className={`italic ${isDark ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>
            {children}
          </em>
        ),

        ul: ({ children }) => (
          <ul className="mb-2.5 space-y-1 pl-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2.5 ml-5 space-y-1 list-decimal">{children}</ol>
        ),
        li: ({ children, ordered, ...props }) => {
          if (ordered) {
            return (
              <li className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-950 font-medium'}`} {...props}>
                {children}
              </li>
            );
          }
          return (
            <li className={`text-sm leading-relaxed flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-950 font-medium'}`} {...props}>
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${isDark ? 'bg-sky-400' : 'bg-sky-600'}`} />
              <span>{children}</span>
            </li>
          );
        },

        blockquote: ({ children }) => (
          <blockquote
            className={`my-2.5 border-l-4 pl-4 py-1.5 text-sm italic font-medium ${
              isDark
                ? 'border-sky-500/50 bg-sky-500/5 text-sky-300/80'
                : 'border-sky-600 bg-sky-100/70 text-slate-950'
            }`}
          >
            {children}
          </blockquote>
        ),

        hr: () => (
          <hr className={`my-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
        ),

        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium underline underline-offset-2 transition-colors ${
              isDark
                ? 'text-sky-400 hover:text-sky-300'
                : 'text-sky-600 hover:text-sky-500'
            }`}
          >
            {children}
          </a>
        ),

        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl">
            <table className={`w-full text-xs border-collapse ${isDark ? 'border border-white/10' : 'border border-slate-200'}`}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={isDark ? 'bg-sky-900/30' : 'bg-sky-50'}>{children}</thead>
        ),
        th: ({ children }) => (
          <th className={`px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-sky-300 border-b border-white/10' : 'text-sky-700 border-b border-slate-200'}`}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={`px-3 py-2 text-xs ${isDark ? 'text-slate-300 border-b border-white/5' : 'text-slate-700 border-b border-slate-100'}`}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default AIMarkdownRenderer;
