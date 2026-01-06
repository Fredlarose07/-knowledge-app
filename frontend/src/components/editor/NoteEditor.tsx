/**
 * NoteEditor - Wrapper pour l'éditeur Novel
 * Gère l'édition du contenu de la note
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface NoteEditorProps {
  content: any;
  onChange: (content: any) => void;
  editable?: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
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

  // Mettre à jour le contenu si il change de l'extérieur
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