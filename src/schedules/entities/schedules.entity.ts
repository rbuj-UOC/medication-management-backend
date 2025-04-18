import { Interval } from "src/intervals/entities/intervals.entity";
import { Medication } from "src/medications/entities/medications.entity";
import { User } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  medication_id: number;

  @PrimaryColumn()
  interval_id: number;

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

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: "user_id" })
  public user: User

  @ManyToOne(() => Medication, (medication) => medication.schedules)
  @JoinColumn({ name: "medication_id" })
  public medication: Medication

  @ManyToOne(() => Interval, (interval) => interval.schedules)
  @JoinColumn({ name: "interval_id" })
  public interval: Interval
}
