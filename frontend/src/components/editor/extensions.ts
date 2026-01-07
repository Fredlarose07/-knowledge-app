/**
 * Extensions Tiptap pour Novel
 * Inclut StarterKit + notre extension [[liens]]
 */

import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { NoteMention } from './NoteMentionExtension';

export const defaultExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Titre`;
      }
      return "Tapez '/' pour les commandes...";
    },
  }),
  NoteMention.configure({
    onMentionClick: undefined, // Sera configuré depuis le composant parent
  }),
];