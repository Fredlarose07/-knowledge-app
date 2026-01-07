/**
 * NoteMentionExtension - Détection [[liens]] avec Cmd/Ctrl+Clic
 */

import { Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface NoteMentionOptions {
  onMentionClick?: (noteName: string) => void;
}

export const NoteMention = Node.create<NoteMentionOptions>({
  name: 'noteMention',

  addOptions() {
    return {
      onMentionClick: undefined,
    };
  },

  addProseMirrorPlugins() {
    const self = this;
    
    return [
      new Plugin({
        key: new PluginKey('noteMentionHighlight'),
        state: {
          init(_, { doc }) {
            return buildDecorations(doc);
          },
          apply(tr, set) {
            if (!tr.docChanged) return set;
            return buildDecorations(tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement;
              
              // Cmd (Mac) ou Ctrl (Windows/Linux) + Clic
              const isModifierClick = event.metaKey || event.ctrlKey;
              
              if (isModifierClick && target.classList.contains('note-mention-link')) {
                const text = target.textContent || '';
                const match = text.match(/\[\[([^\]]+)\]\]/);
                
                if (match && match[1] && self.options.onMentionClick) {
                  self.options.onMentionClick(match[1]);
                  event.preventDefault();
                  return true;
                }
              }
              
              return false;
            },
          },
        },
      }),
    ];
    
    function buildDecorations(doc: any) {
      const decorations: Decoration[] = [];
      const regex = /\[\[([^\]]+)\]\]/g;

      doc.descendants((node: any, pos: number) => {
        if (node.isText && node.text) {
          let match;
          while ((match = regex.exec(node.text)) !== null) {
            const from = pos + match.index;
            const to = from + match[0].length;
            
            decorations.push(
              Decoration.inline(from, to, {
                class: 'note-mention-link',
              })
            );
          }
        }
      });

      return DecorationSet.create(doc, decorations);
    }
  },
});