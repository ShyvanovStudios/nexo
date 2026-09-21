import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '../../services/notes';
import { ScopeBadge } from '../../components/ui/ScopeBadge';
import { useScopes } from '../../hooks/useScopes';
import { useFilterStore } from '../../stores/filterStore';
import { formatDate } from '../../utils/date';
import type { Note } from '../../types';

export function NotesPage() {
  const qc = useQueryClient();
  const { scopeId, setScopeId } = useFilterStore();
  const { data: scopes = [] } = useScopes();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const params: Record<string, string> = {};
  if (scopeId) params.scope_id = String(scopeId);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesService.list(params),
  });

  const createNote = useMutation({
    mutationFn: (data: Partial<Note>) => notesService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes'] }); setShowForm(false); },
  });

  const updateNote = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Note> }) => notesService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes'] }); setEditingNote(null); },
  });

  const deleteNote = useMutation({
    mutationFn: (id: number) => notesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });

  const togglePin = (note: Note) => {
    updateNote.mutate({ id: note.id, data: { is_pinned: !note.is_pinned } });
  };

  const convertToTask = useMutation({
    mutationFn: (id: number) => notesService.convertToTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  });

  const pinned = notes.filter((n) => n.is_pinned);
  const unpinned = notes.filter((n) => !n.is_pinned);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Notas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors min-h-[44px]"
        >
          + Nueva nota
        </button>
      </div>

      {/* Scope filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setScopeId(null)} className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] ${!scopeId ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>Todas</button>
        {scopes.map((s) => (
          <button key={s.id} onClick={() => setScopeId(s.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] ${scopeId === s.id ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`} style={scopeId === s.id ? { backgroundColor: s.color } : undefined}>{s.name}</button>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <NoteFormCard
          scopes={scopes}
          onSave={(data) => createNote.mutate(data)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Cargando...</div>
      ) : (
        <>
          {/* Pinned */}
          {pinned.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Fijadas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinned.map((n) => (
                  <NoteCard key={n.id} note={n} onPin={togglePin} onDelete={(id) => deleteNote.mutate(id)} onConvertToTask={(id) => convertToTask.mutate(id)} onEdit={setEditingNote} />
                ))}
              </div>
            </div>
          )}

          {/* Other */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpinned.map((n) => (
              <NoteCard key={n.id} note={n} onPin={togglePin} onDelete={(id) => deleteNote.mutate(id)} onConvertToTask={(id) => convertToTask.mutate(id)} onEdit={setEditingNote} />
            ))}
          </div>

          {notes.length === 0 && !showForm && (
            <div className="text-center py-16 text-gray-400">Sin notas</div>
          )}
        </>
      )}

      {/* Edit modal */}
      {editingNote && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditingNote(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
            <NoteFormCard
              scopes={scopes}
              initialData={editingNote}
              onSave={(data) => updateNote.mutate({ id: editingNote.id, data })}
              onCancel={() => setEditingNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, onPin, onDelete, onConvertToTask, onEdit }: {
  note: Note; onPin: (n: Note) => void; onDelete: (id: number) => void; onConvertToTask: (id: number) => void; onEdit: (n: Note) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer" onClick={() => onEdit(note)}>
          {note.title || 'Sin título'}
        </h3>
        <button onClick={() => onPin(note)} className="text-gray-400 hover:text-yellow-500 flex-shrink-0" aria-label={note.is_pinned ? 'Desfijar' : 'Fijar'}>
          <svg className={`w-4 h-4 ${note.is_pinned ? 'text-yellow-500 fill-yellow-500' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      </div>
      {note.content && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{note.content}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <ScopeBadge scope={note.scope} />
        <span className="text-[10px] text-gray-400">{formatDate(note.created_at)}</span>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => onConvertToTask(note.id)} className="text-[10px] text-primary-600 hover:underline">Convertir en tarea</button>
        <button onClick={() => onDelete(note.id)} className="text-[10px] text-red-500 hover:underline">Eliminar</button>
      </div>
    </div>
  );
}

function NoteFormCard({ scopes, initialData, onSave, onCancel }: {
  scopes: import('../../types').Scope[]; initialData?: Partial<Note>; onSave: (data: Partial<Note>) => void; onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [scopeId, setScopeId] = useState(initialData?.scope_id || (scopes[0]?.id ?? 0));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full text-sm font-semibold bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 pb-2 focus:ring-0 focus:border-primary-500 min-h-[44px]" autoFocus />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu nota..." rows={4} className="w-full text-sm bg-transparent border-0 focus:ring-0 resize-none" />
      <div className="flex items-center gap-3">
        <select value={scopeId} onChange={(e) => setScopeId(Number(e.target.value))} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-xs min-h-[40px]">
          {scopes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="ml-auto flex gap-2">
          <button onClick={onCancel} className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 min-h-[40px]">Cancelar</button>
          <button onClick={() => onSave({ title, content, scope_id: scopeId } as Partial<Note>)} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium min-h-[40px]">Guardar</button>
        </div>
      </div>
    </div>
  );
}
