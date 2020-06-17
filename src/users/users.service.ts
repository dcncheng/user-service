import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signup(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        const payload: JwtPayload = {username};
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

    async checkUsername(username: string) {
        const user = await this.userRepository.checkUsername(username)
        if (!user) {
            throw new NotFoundException(`User with name ${username} not found!`);
        }
        console.log('user found with: ', user);
        return {username: user.username};
    }
}
