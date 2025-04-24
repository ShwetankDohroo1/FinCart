import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/role.decorator";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector ){}

    canActivate(context: ExecutionContext): boolean{
        const reqRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);
        if(!reqRoles){
            return true;
        }
        const {user} = context.switchToHttp().getRequest();
        return reqRoles.includes(user.role);
    }
}