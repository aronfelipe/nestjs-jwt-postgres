import { ApiProperty } from "@nestjs/swagger";

export class AuthenticationUser {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}