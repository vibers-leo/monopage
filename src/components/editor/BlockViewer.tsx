"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect } from 'react';

interface BlockViewerProps {
  content: string;
}

export default function BlockViewer({ content }: BlockViewerProps) {
  const editor = useEditor({
    editable: false, // 읽기 전용
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-6 shadow-sm',
        },
      }),
      Link.configure({
        openOnClick: true, // 클릭 시 링크 열림
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
          target: '_blank',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none',
      },
    },
  });

  // content가 변경되면 에디터 내용 업데이트 (비동기 데이터 로딩 대응)
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
