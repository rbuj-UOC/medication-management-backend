import { Schedule } from 'src/schedules/entities/schedules.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'medications' })
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: false, nullable: false })
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.medication)
  schedules: Schedule[];

  @ManyToOne(() => User, (user) => user.medications, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
