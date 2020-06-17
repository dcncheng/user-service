import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signup(authCredentialDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === 11000) { // duplicate username
                throw new ConflictException(`Username ${username} already exists!`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;

        const user = await this.findOne({username});

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    async checkUsername(username: string) {
        const queryJson = {
            "username": username 
        };
        return this.findOne(queryJson);
    }

    private async hashPassword (password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}