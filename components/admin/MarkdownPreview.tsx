'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="text-[#374151] w-full p-4 bg-white border border-gray-200 rounded-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || '*No content to preview*'}
      </ReactMarkdown>
    </div>
  );
}
