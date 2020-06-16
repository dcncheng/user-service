import { Controller, Post, Body, ValidationPipe, UseGuards, Req, HttpCode } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Post('/signup')
    signup(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersService.signup(authCredentialsDto);
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.usersService.signIn(authCredentialsDto);
    }

    @Post('/authenticate')
    @UseGuards(AuthGuard())
    @HttpCode(200)
    authenticate(@GetUser() user: User) {
        return {username: user.username};
    }
}
