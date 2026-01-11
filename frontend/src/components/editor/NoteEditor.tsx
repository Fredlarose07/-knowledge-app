/**
 * NoteEditor - Éditeur Tiptap avec [[liens]] et détection existence
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { NoteMention } from './NoteMentionExtension';

interface NoteEditorProps {
  content: any;
  onChange: (content: any) => void;
  onMentionClick?: (noteName: string) => void;
  checkNoteExists?: (noteName: string) => Promise<boolean>;
  editable?: boolean;
  placeholder?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  onMentionClick,
  checkNoteExists,
  editable = true,
  placeholder = "Tapez '/' pour les commandes ou commencez à écrire...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      NoteMention.configure({
        onMentionClick,
        checkNoteExists,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] text-neutral-200',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content);
      if (!isSame) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="note-editor">
      <EditorContent editor={editor} />
    </div>
  );
};