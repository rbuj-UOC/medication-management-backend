import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { Medication } from 'src/medications/entities/medications.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, nullable: false })
  username: string;

  @Column('varchar', { unique: true, nullable: false })
  email: string;

  @Column('varchar', { nullable: false, select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

  @OneToMany(() => Medication, (medication) => medication.user)
  medications: Medication[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordUpdate() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
