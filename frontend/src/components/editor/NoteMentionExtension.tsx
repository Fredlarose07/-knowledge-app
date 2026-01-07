/**
 * NoteMentionExtension - Extension pour [[liens]] cliquables
 * Crochets visibles en mode édition, cachés sinon
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
            return buildDecorations(doc, null);
          },
          apply(tr, set) {
            if (!tr.docChanged && !tr.selectionSet) {
              return set;
            }
            
            const { selection } = tr;
            const cursorPos = selection.empty ? selection.$anchor.pos : null;
            
            return buildDecorations(tr.doc, cursorPos);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          
          // Gérer les clics
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement;
              
              // Vérifier si on a cliqué sur un lien (mode lecture)
              if (target.classList.contains('note-mention-link-display')) {
                const noteName = target.getAttribute('data-note-display');
                
                if (noteName && self.options.onMentionClick) {
                  console.log('Clic sur lien:', noteName);
                  self.options.onMentionClick(noteName);
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
    
    function buildDecorations(doc: any, cursorPos: number | null) {
      const decorations: Decoration[] = [];
      const regex = /\[\[([^\]]+)\]\]/g;

      doc.descendants((node: any, pos: number) => {
        if (node.isText && node.text) {
          let match;
          while ((match = regex.exec(node.text)) !== null) {
            const from = pos + match.index;
            const to = from + match[0].length;
            const noteName = match[1];
            
            // Vérifier si le curseur est dans le lien
            const cursorInLink = cursorPos !== null && 
              cursorPos >= from && 
              cursorPos <= to;
            
            if (cursorInLink) {
              // Mode édition : afficher normalement avec style
              decorations.push(
                Decoration.inline(from, to, {
                  class: 'note-mention-link-editing',
                })
              );
            } else {
              // Mode lecture : afficher sans crochets
              decorations.push(
                Decoration.inline(from, to, {
                  class: 'note-mention-link-display',
                  'data-note-display': noteName,
                })
              );
            }
          }
        }
      });

      return DecorationSet.create(doc, decorations);
    }
  },
});