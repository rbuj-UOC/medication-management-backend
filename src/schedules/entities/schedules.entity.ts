import { Medication } from 'src/medications/entities/medications.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @Column({ nullable: false })
  cron_expression: string;

  @Column('varchar', { nullable: false })
  disabled: boolean;

  @ManyToOne(() => Medication, (medication) => medication.schedules, {
    onDelete: 'CASCADE',
  })
  medication: Medication;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
