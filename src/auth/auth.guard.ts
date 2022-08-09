import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService){

  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    try{
      const jwtToken = request.cookies['auth']
      return this.jwtService.verify(jwtToken)
    }catch(e){
      return false
    }
  }
}
