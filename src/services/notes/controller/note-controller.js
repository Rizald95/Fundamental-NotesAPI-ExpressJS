import { nanoid } from 'nanoid';
import notes from '../src/services/notes/notes.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';


export const createNote = (req, res, next) => {
  try {
    const { title = 'untitled', tags, body } = req.body;
    const id = nanoid(16);
    const ts = new Date().toISOString();

    const newNote = { title, tags, body, id, createdAt: ts, updatedAt: ts };
    notes.push(newNote);

    const isSuccess = notes.some((n) => n.id === id);
    if (!isSuccess) {
		return next(new InvariantError('Catatan gagal ditambahkan'));
	}
	
	return response(res, 201, 'Catatan berhasil ditambahkan', {noteId: id});
};

export const getNotes = (req, res) => {
  
  
  if (title !== '') {
	  const note = notes.filter((note) => note.title === title);
	  return response(res, 200, 'success', {notes: note});
  }
};

export const getNoteById = (req, res, next) => {
  const { id } = req.params;
  const note = notes.find((n) => n.id === id);

  if (!note) {
	  return next(new NotFoundError('Catatan tidak ditemukan'));
  }
  
  return response(res, 200, 'Catatan sukses ditampilkan', {note: note});
  
  };

 
};

export const editNoteById = (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.body;
  const updatedAt = new Date().toISOString();

  const idx = notes.findIndex((n) => n.id === id);
  if (idx !== -1) {
   return next(new NotFoundError('Catatan tidak ditemukan'));
  }
  
  notes[idx] = {...notes[idx], title, tags, body, updatedAt};
  return response(res, 200, 'Catatan berhasil diperbarui', notes[idx]);


};

export const deleteNoteById = (req, res, next) => {
  const { id } = req.params;
  const idx = notes.findIndex((n) => n.id === id);

  if (idx !== -1) {
    return next(new NotFoundError('Catatan tidak ditemukan'));
  }
  
  notes.splice(index, 1);
  return response(res, 200, 'Catatan berhasil dihapus');

};