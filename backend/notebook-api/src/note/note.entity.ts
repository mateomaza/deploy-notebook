import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Tag, (tag) => tag.notes)
  tags: Tag[];

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  archived: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
