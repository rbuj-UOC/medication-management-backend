import { ApiProperty } from '@nestjs/swagger';
import { Schedule } from 'src/schedules/entities/schedules.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'confirmation' })
export class Confirmation {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: 'number',
    description: 'ID of the confirmation',
    example: 1,
  })
  id: number;

  @Column('boolean', { nullable: false, default: false })
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates if the schedule is confirmed',
    example: false,
  })
  confirmed: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    type: 'string',
    description: 'Notification date of the schedule',
    example: '2023-10-01T12:00:00Z',
  })
  notification_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    type: 'string',
    description: 'Creation date of the medication',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    type: 'string',
    description: 'Last update date of the medication',
    example: '2023-10-01T12:00:00Z',
  })
  updated_at: Date;

  // Relationships

  // Schedule associated with the confirmation
  @ManyToOne(() => Schedule, (schedule) => schedule.confirmations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
