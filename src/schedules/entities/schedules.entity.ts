import { Frequency } from 'src/common/enums/frequency.enum';
import { Medication } from 'src/medications/entities/medications.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @Column('varchar', { unique: false, length: 40, default: Frequency.Daily })
  frequency: string;

  @Column('smallint', { nullable: false })
  hour: number;

  @Column('smallint', { nullable: false })
  minute: number;

  @Column('varchar', { length: 40, nullable: false })
  cron_expression: string;

  @Column('boolean', { nullable: false, default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Medication, (medication) => medication.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medication_id' })
  medication: Medication;
}
