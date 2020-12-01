import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../user.model";

export class StoreOneUser {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    role: UserRole;
}