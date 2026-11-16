import ReactMarkdown from "react-markdown";

export default function PostBody({ content }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="font-heading font-bold text-xl text-primary mt-8 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-heading font-semibold text-lg text-primary mt-6 mb-2">{children}</h3>
        ),
        p: ({ children }) => <p className="text-foreground/85 leading-relaxed mb-4">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-foreground/85">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-foreground/85">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground mb-4">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-secondary underline underline-offset-2" target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}