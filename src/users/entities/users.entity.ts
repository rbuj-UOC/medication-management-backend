import { Length } from '@nestjs/class-validator';
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

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  name: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  surname_1: string;

  @Column('varchar', { length: 25, nullable: true })
  @Length(3, 25)
  surname_2: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  alias: string;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  birth_date: Date;

  @Column('varchar', { unique: true, length: 255, nullable: false })
  email: string;

  @Column('varchar', { select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

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

  @OneToMany(() => Medication, (medication) => medication.user)
  medications: Medication[];
}
