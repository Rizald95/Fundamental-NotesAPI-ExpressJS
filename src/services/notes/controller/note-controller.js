import { nanoid } from 'nanoid';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import NoteRepositories from '../repositories/note-repositories.js';



export const createNote = async (req, res, next) => {
	const {title, body, tags } = req.validated;
	const note = await NoteRepositories.createNote({
		title,
		body,
		tags
	});
	
	if (!note) {
		return next(new InvariantError('Catatan gagal ditambahkan'));
		
	}
	
	return response(res, 201, 'Catatan berhasil ditambahkan', note);
	
};

export const getNotes = async (req, res) => {
  const notes = await NoteRepositories.getNotes();
  return response(res, 200, 'Catatan sukses ditampilkan', notes);
  
};

export const getNoteById = async (req, res, next) => {
	const {id} = req.params;
	const note = await NoteRepositories.getNoteById(id);
	
	if (!note) {
		return next(new NotFoundError('Catatn tidak ditemukan'));
		
	}
	
	return response(res, 200, 'Catatan sukses ditampilkan', note);
	
};

export const editNoteById = (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.validated;
  
  const note = await NoteRepositories.editNote({
	  id,
	  title,
	  body,
	  tags
  });
  
  if(!note) {
	  return next(new NotFoundError('Catatan tidak ditemukan'));
  }
  
  return response(res, 200, 'Catatan berhasil diperbarui', note);

};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const deletedNote = await NoteRepositories.deleteNote(id);
  
  if (!deletedNote) {
	  return next(new NotFoundError('Catatn tidak ditemukan'));
	  
  }
  
  return response(res, 200, 'Catatan berhasil dihapus', deletedNote);
  
};