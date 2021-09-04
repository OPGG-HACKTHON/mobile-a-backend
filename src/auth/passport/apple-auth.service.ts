import { Injectable, ForbiddenException } from '@nestjs/common';
import * as appleSignin from 'apple-signin';
import path = require('path');

@Injectable()
export class AppleService {
  clientID = process.env.APPLE_AUTH_CLIENT_ID;
  teamID = process.env.APPLE_AUTH_TEAM_ID;
  keyID = process.env.APPLE_AUTH_KEY_ID;
  callbackURL = process.env.APPLE_AUTH_CALLBACK_URL;
  privateKey = process.env.PRIVATE_KEY;

  async verifyUser(payload: any): Promise<any> {
    const clientSecret = appleSignin.getClientSecret({
      clientID: this.clientID,
      teamId: this.teamID,
      keyIdentifier: this.keyID,
      privateKeyPath: path.join(__dirname, this.privateKey),
    });

    const tokens = await appleSignin.getAuthorizationToken(payload.code, {
      clientID: this.clientID,
      clientSecret: clientSecret,
      redirectUri: this.callbackURL,
    });

    if (!tokens.id_token) {
      console.log('id_token이 존재 하지 않습니다.');
      throw new ForbiddenException();
    }

    console.log('tokens : ', tokens);

    // TODO: AFTER THE FIRST LOGIN APPLE WON'T SEND THE USERDATA ( FIRST NAME AND LASTNAME, ETC.) THIS SHOULD BE SAVED ANYWHERE

    const data = await appleSignin.verifyIdToken(tokens.id_token);
    console.log('data : ', data);
    return { data, tokens };
  }
}
