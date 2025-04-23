import { Schedule } from 'src/schedules/entities/schedules.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'medication' })
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: false, length: 255, nullable: false })
  name: string;

  @Column('boolean', { nullable: false, default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.medications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Schedule, (schedule) => schedule.medication)
  schedules: Schedule[];
}
