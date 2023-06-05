import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as dotenv from 'dotenv'
dotenv.config()

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor() {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    })
  }

  validate(payload: any) {
    console.log(payload)
  }
}
