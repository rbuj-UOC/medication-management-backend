import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: 'number',
    description: 'ID of the medication',
    example: 1,
  })
  id: number;

  @Column('varchar', { unique: false, length: 255, nullable: false })
  @ApiProperty({
    type: 'string',
    description: 'Name of the medication',
    example: 'Paracetamol 1g',
  })
  name: string;

  @Column('boolean', { nullable: false, default: false })
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates if the medication is disabled',
    example: false,
  })
  disabled: boolean;

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

  // User who created the medication
  @ManyToOne(() => User, (user) => user.medications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Schedules associated with the medication
  @OneToMany(() => Schedule, (schedule) => schedule.medication)
  schedules: Schedule[];
}
