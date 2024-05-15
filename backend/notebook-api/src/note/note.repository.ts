import { DatabaseModule } from '../database/database.module';
import { Note } from './note.entity';

const dataSource = DatabaseModule.getDataSource();

export const NoteRepository = dataSource.getRepository(Note);
