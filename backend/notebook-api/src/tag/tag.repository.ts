import { DatabaseModule } from '../database/database.module';
import { Tag } from './tag.entity';

const dataSource = DatabaseModule.getDataSource();

export const TagRepository = dataSource.getRepository(Tag);
