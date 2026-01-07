// src/components/editor/BlockEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '@/lib/upload';

interface BlockEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export default function BlockEditor({ 
  content = '', 
  onChange,
  editable = true 
}: BlockEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: '당신의 이야기를 시작하세요... (이미지는 드래그하거나 버튼을 눌러 추가하세요)',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    // 파일 선택창 생성 및 클릭
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          const url = await uploadImage(file, 'editor-images');
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          alert('이미지 업로드에 실패했습니다.');
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL을 입력하세요:', previousUrl);
    
    // 취소됨
    if (url === null) {
      return;
    }

    // 빈 문자열 입력 시 링크 해제
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // 링크 설정
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm group transition-all hover:border-foreground/20">
      {/* 툴바 */}
      {editable && (
        <div className="border-b border-border bg-muted/50 p-2 flex flex-wrap items-center gap-1 sticky top-0 z-10 backdrop-blur-sm">
          {/* 텍스트 스타일 */}
          <div className="flex gap-0.5 pr-2 border-r border-border/50">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('bold') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('italic') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('strike') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Strikethrough size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('code') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Code size={18} />
            </button>
          </div>

          {/* 제목 */}
          <div className="flex gap-0.5 pr-2 border-r border-border/50">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Heading1 size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Heading2 size={18} />
            </button>
          </div>

          {/* 리스트 */}
          <div className="flex gap-0.5 pr-2 border-r border-border/50">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('bulletList') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('orderedList') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('blockquote') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Quote size={18} />
            </button>
          </div>

          {/* 미디어 */}
          <div className="flex gap-0.5 pr-2 border-r border-border/50">
            <button
              onClick={addImage}
              disabled={isUploading}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                isUploading ? 'opacity-50 cursor-wait' : ''
              } text-muted-foreground hover:text-foreground`}
              title="Add Image"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
            </button>
            <button
              onClick={setLink}
              className={`p-2 rounded-md hover:bg-muted-foreground/10 transition-colors ${
                editor.isActive('link') ? 'bg-muted-foreground/10 text-foreground' : 'text-muted-foreground'
              }`}
              title="Add Link"
            >
              <LinkIcon size={18} />
            </button>
          </div>

          {/* 실행 취소/다시 실행 */}
          <div className="flex gap-0.5 ml-auto">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-md hover:bg-muted-foreground/10 transition-colors disabled:opacity-30 text-muted-foreground"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-md hover:bg-muted-foreground/10 transition-colors disabled:opacity-30 text-muted-foreground"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 에디터 내용 영역 */}
      <div className="min-h-[500px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
