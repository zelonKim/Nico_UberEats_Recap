import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware { // 미들웨어를 생성함.
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt']; // 요청의 헤더에서 토큰을 얻어옴.

      try {
        const decoded = this.jwtService.verify(token.toString()); // 토큰을 통해 검증함.
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user; // 요청에 사용자 정보를 담음.
        }
      } catch (err) {}
    }
    next();
  }
}
