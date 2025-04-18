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

  @Column('varchar', { unique: true, length: 255, nullable: false })
  username: string;

  @Column('varchar', { unique: true, length: 255, nullable: false })
  email: string;

  @Column('varchar', { length: 40, select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, length: 10, default: Role.User })
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
