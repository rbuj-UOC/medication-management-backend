import { User } from "src/users/entities/users.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'medications' })
export class Medication {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { unique: true, nullable: false })
  name: string

  @ManyToOne(() => User, (user) => user.medications)
  user: User
}