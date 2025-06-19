import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from 'src/common/enums/frequency.enum';
import { Confirmation } from 'src/confirmations/entities/confirmations.entity';
import { Medication } from 'src/medications/entities/medications.entity';
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

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'ID of the schedule',
  })
  id: number;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  @ApiProperty({
    example: '2023-10-01T08:00:00Z',
    description: 'Start date of the schedule',
  })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({
    example: '2023-10-01T08:00:00Z',
    description: 'End date of the schedule',
    nullable: true,
    required: false,
  })
  end_date: Date;

  @Column({
    type: 'time without time zone',
    nullable: false,
    default: () => 'CURRENT_TIME',
  })
  @ApiProperty({
    example: '08:00:00',
    description: 'Time of the schedule',
  })
  time: Date;

  @Column('varchar', { unique: false, length: 40, default: Frequency.Daily })
  @ApiProperty({
    example: 'daily',
    description: 'Frequency of the schedule',
    default: Frequency.Daily,
  })
  frequency: string;

  @Column('varchar', { length: 40, nullable: false })
  @ApiProperty({
    example: '0 8 * * *',
    description: 'Cron expression for the schedule',
  })
  cron_expression: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2023-10-01T08:00:00Z',
    description: 'Creation date of the schedule',
  })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2023-10-01T08:00:00Z',
    description: 'Last update date of the schedule',
  })
  updated_at: Date;

  // Relationships

  // Medication associated with the schedule
  @ManyToOne(() => Medication, (medication) => medication.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medication_id' })
  medication: Medication;

  // Confirmations associated with the schedule
  @OneToMany(() => Confirmation, (confirmation) => confirmation.schedule)
  confirmations: Confirmation[];
}
