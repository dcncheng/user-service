import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @ObjectIdColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    async validatePassword(password: string): Promise<boolean> {
        const decryptedPassword = await bcrypt.hash(password, this.salt);
        return decryptedPassword === this.password;
    }
}