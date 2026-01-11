/**
 * NoteMentionExtension - Détection [[liens]] avec vérification temps réel
 * Système d'événement pour forcer rebuild après clearCache
 */

import { Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface NoteMentionOptions {
  onMentionClick?: (noteName: string) => void;
  checkNoteExists?: (noteName: string) => Promise<boolean>;
}

// Cache global
const noteExistsCache = new Map<string, boolean>();
// Débounce
let checkTimeout: number | null = null;
// Listeners pour forcer rebuild
const rebuildListeners: Array<() => void> = [];

// Fonction pour clear le cache + notifier les listeners
export function clearNoteCache(noteName?: string) {
  if (noteName) {
    console.log(`🧹 Clearing cache for "${noteName}"`);
    noteExistsCache.delete(noteName);
  } else {
    console.log(`🧹 Clearing entire cache`);
    noteExistsCache.clear();
  }
  
  // Notifier tous les éditeurs pour qu'ils rebuild
  console.log(`📢 Notifying ${rebuildListeners.length} listeners`);
  rebuildListeners.forEach(listener => listener());
}

export const NoteMention = Node.create<NoteMentionOptions>({
  name: 'noteMention',

  addOptions() {
    return {
      onMentionClick: undefined,
      checkNoteExists: undefined,
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
          apply(tr, set, oldState, newState) {
            // Rebuild si meta flag OU doc changed
            if (tr.getMeta('forceNoteMentionRebuild') || tr.docChanged) {
              // Si doc changed, vérifier les nouveaux liens après un délai
              if (tr.docChanged && self.options.checkNoteExists) {
                if (checkTimeout) clearTimeout(checkTimeout);
                
                checkTimeout = setTimeout(async () => {
                  const notesToCheck: string[] = [];
                  const regex = /\[\[([^\]]+)\]\]/g;
                  
                  // Collecter les liens qui ne sont PAS dans le cache
                  newState.doc.descendants((node: any) => {
                    if (node.isText && node.text) {
                      let match;
                      while ((match = regex.exec(node.text)) !== null) {
                        const noteName = match[1];
                        if (!notesToCheck.includes(noteName) && !noteExistsCache.has(noteName)) {
                          notesToCheck.push(noteName);
                        }
                      }
                    }
                  });
                  
                  if (notesToCheck.length > 0) {
                    console.log(`🔍 Checking new links: [${notesToCheck.join(', ')}]`);
                    
                    // Vérifier en parallèle
                    await Promise.all(
                      notesToCheck.map(async (noteName) => {
                        try {
                          const exists = await self.options.checkNoteExists!(noteName);
                          noteExistsCache.set(noteName, exists);
                          console.log(`  ✅ "${noteName}" → ${exists ? 'EXISTS' : 'NOT FOUND'}`);
                        } catch (error) {
                          console.error(`  ❌ Error:`, error);
                          noteExistsCache.set(noteName, true);
                        }
                      })
                    );
                    
                    // Forcer rebuild avec le cache à jour
                    const view = (newState as any).view;
                    if (view) {
                      console.log('🔄 Cache updated, forcing rebuild...');
                      const tr = view.state.tr;
                      tr.setMeta('forceNoteMentionRebuild', true);
                      tr.setMeta('addToHistory', false);
                      view.dispatch(tr);
                    }
                  }
                }, 500) as unknown as number;
              }
              
              return buildDecorations(tr.doc);
            }
            return set;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement;
              
              const isModifierClick = event.metaKey || event.ctrlKey;
              
              if (isModifierClick && 
                  (target.classList.contains('note-mention-link') || 
                   target.classList.contains('note-mention-link-broken'))) {
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
        view(editorView) {
          // Fonction pour forcer rebuild de cet éditeur
          const forceRebuild = () => {
            console.log('🔄 Force rebuild triggered by cache clear');
            const tr = editorView.state.tr;
            tr.setMeta('forceNoteMentionRebuild', true);
            tr.setMeta('addToHistory', false);
            editorView.dispatch(tr);
          };
          
          // S'enregistrer comme listener
          rebuildListeners.push(forceRebuild);
          console.log(`📝 Registered rebuild listener (total: ${rebuildListeners.length})`);
          
          // Vérification initiale au montage
          if (self.options.checkNoteExists) {
            setTimeout(async () => {
              const notesToCheck: string[] = [];
              const regex = /\[\[([^\]]+)\]\]/g;
              
              editorView.state.doc.descendants((node: any) => {
                if (node.isText && node.text) {
                  let match;
                  while ((match = regex.exec(node.text)) !== null) {
                    const noteName = match[1];
                    if (!notesToCheck.includes(noteName) && !noteExistsCache.has(noteName)) {
                      notesToCheck.push(noteName);
                    }
                  }
                }
              });
              
              if (notesToCheck.length > 0) {
                console.log(`📊 Initial check: [${notesToCheck.join(', ')}]`);
                
                await Promise.all(
                  notesToCheck.map(async (noteName) => {
                    try {
                      const exists = await self.options.checkNoteExists!(noteName);
                      noteExistsCache.set(noteName, exists);
                      console.log(`  ✅ "${noteName}" → ${exists ? 'EXISTS' : 'NOT FOUND'}`);
                    } catch (error) {
                      noteExistsCache.set(noteName, true);
                    }
                  })
                );
                
                const tr = editorView.state.tr;
                tr.setMeta('forceNoteMentionRebuild', true);
                tr.setMeta('addToHistory', false);
                editorView.dispatch(tr);
              }
            }, 200);
          }
          
          return {
            destroy() {
              // Se désinscrire au démontage
              const index = rebuildListeners.indexOf(forceRebuild);
              if (index > -1) {
                rebuildListeners.splice(index, 1);
                console.log(`🗑️ Unregistered rebuild listener (remaining: ${rebuildListeners.length})`);
              }
            }
          };
        },
      }),
    ];
    
    function buildDecorations(doc: any) {
      const decorations: Decoration[] = [];
      const regex = /\[\[([^\]]+)\]\]/g;

      doc.descendants((node: any, pos: number) => {
        if (node.isText && node.text) {
          let match;
          regex.lastIndex = 0;
          while ((match = regex.exec(node.text)) !== null) {
            const from = pos + match.index;
            const to = from + match[0].length;
            const noteName = match[1];
            
            const exists = noteExistsCache.get(noteName);
            const className = exists === false ? 'note-mention-link-broken' : 'note-mention-link';
            
            decorations.push(
              Decoration.inline(from, to, {
                class: className,
              })
            );
          }
        }
      });

      return DecorationSet.create(doc, decorations);
    }
  },
});