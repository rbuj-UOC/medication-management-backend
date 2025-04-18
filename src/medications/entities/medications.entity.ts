import { UserMedicationSchedule } from 'src/users_medications_schedules/entities/users_medications_schedules.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'medications' })
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: false, length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => UserMedicationSchedule, userMedicationSchedule => userMedicationSchedule.medication)
  public ums: UserMedicationSchedule[];
}
