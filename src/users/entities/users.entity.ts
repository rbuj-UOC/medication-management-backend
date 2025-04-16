import { Length } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { Medication } from 'src/medications/entities/medications.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the user',
  })
  id: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  name: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  @ApiProperty({
    example: 'Doe',
    description: 'Last first surname of the user',
  })
  surname_1: string;

  @Column('varchar', { length: 25, nullable: true })
  @Length(3, 25)
  @ApiProperty({
    example: 'Smith',
    description: 'Last second surname of the user',
    required: false,
  })
  surname_2: string;

  @Column('varchar', { length: 25, nullable: false })
  @Length(3, 25)
  @ApiProperty({
    example: 'johndoe',
    description: 'Alias of the user',
  })
  alias: string;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was last updated',
  })
  birth_date: Date;

  @Column('varchar', { unique: true, length: 255, nullable: false })
  @ApiProperty({
    example: 'test@test.org',
    description: 'Email of the user',
  })
  email: string;

  @Column('varchar', { select: false, nullable: false })
  @ApiProperty({
    example: '$2b$10$SZLyMEmWrwcHRGRQrNFUc.MKNaAxgWmdH/Ox6dewaBtmGKdgdpWO2',
    description: 'Hashed password of the user',
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  @ApiProperty({
    example: Role.User,
    enum: Role,
    enumName: 'Role',
    description: 'Role of the user',
  })
  role: Role;

  @Column('varchar', { nullable: true })
  @ApiProperty({
    description: 'Device token of the user',
  })
  device_token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was created',
  })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was last updated',
  })
  updated_at: Date;

  @BeforeInsert()
  async hashPasswordUpdate() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  // Relationships

  // Medications associated with the user
  @OneToMany(() => Medication, (medication) => medication.user)
  medications: Medication[];

  // Self referencing relation
  @ManyToMany(() => User, (user) => user.contacts)
  @JoinTable()
  contacts: User[];
}
