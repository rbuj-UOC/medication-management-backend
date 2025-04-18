import { Schedule } from 'src/schedules/entities/schedules.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'interval' })
export class Interval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 40, nullable: false })
  cron_expression: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Schedule, schedule => schedule.interval)
  public schedules: Schedule[];
}