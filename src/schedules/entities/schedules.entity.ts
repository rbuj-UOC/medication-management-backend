import { UserMedicationSchedule } from 'src/users_medications_schedules/entities/users_medications_schedules.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 40, nullable: false })
  cron_expression: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => UserMedicationSchedule, userMedicationSchedule => userMedicationSchedule.schedule)
  public ums: UserMedicationSchedule[];
}
