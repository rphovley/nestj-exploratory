import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { AuthLoginDTO } from "src/modules/auth/DTO/auth-login.DTO";
import { User } from "src/modules/user/user.entity";
import { Observable } from "rxjs";
import { Session } from "src/modules/_shared/utils/session";
import { Serialize } from "src/modules/_shared/utils/serialize";

@Injectable()
export class LocalPassportGuard implements CanActivate{
    
    constructor(
        private readonly session: Session,
        private readonly serialize: Serialize
    ){
        
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        const userAuthSession = this.session.get('user-auth');
        if(userAuthSession){
            const user = this.serialize.unserialize(userAuthSession) as User;
            if(typeof user === 'object' && user.id && user.isActive && user.isConfirmed){
                const request = context.switchToHttp().getRequest();
                request.user = user;
                return true;
            }
            else{
                this.session.destroy('user-auth');
                throw new UnauthorizedException();
            }
        }
        else{
            throw new UnauthorizedException();
        }
    }
}