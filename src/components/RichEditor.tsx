import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import './RichEditor.css';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

type ToolbarButton = {
  label: string;
  action: () => void;
  isActive?: () => boolean;
};

export default function RichEditor({ content, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write your post…' }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content]);

  if (!editor) return null;

  const tools: (ToolbarButton | 'sep')[] = [
    {
      label: 'B',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      label: 'I',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      label: 'U',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    'sep',
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    'sep',
    {
      label: '• List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      label: '1. List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    'sep',
    {
      label: '❝',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      label: '—',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
  ];

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        {tools.map((tool, i) =>
          tool === 'sep' ? (
            <div key={i} className="rich-sep" />
          ) : (
            <button
              key={i}
              type="button"
              className={`rich-btn${tool.isActive?.() ? ' active' : ''}`}
              onClick={tool.action}
            >
              {tool.label}
            </button>
          )
        )}
      </div>
      <EditorContent editor={editor} className="rich-content" />
    </div>
  );
}
