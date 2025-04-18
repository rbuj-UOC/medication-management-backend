import { Medication } from "src/medications/entities/medications.entity";
import { Schedule } from "src/schedules/entities/schedules.entity";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users_medications_schedules' })
export class UserMedicationSchedule {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  medication_id: number;

  @PrimaryColumn()
  schedule_id: number;

  @Column({ type: 'timestamptz', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.ums)
  @JoinColumn({ name: "user_id" })
  public user: User

  @ManyToOne(() => Medication, (medication) => medication.ums)
  @JoinColumn({ name: "medication_id" })
  public medication: Medication

  @ManyToOne(() => Schedule, (schedule) => schedule.ums)
  @JoinColumn({ name: "schedule_id" })
  public schedule: Schedule
}
