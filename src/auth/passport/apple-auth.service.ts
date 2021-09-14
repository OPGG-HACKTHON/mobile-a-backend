import { Injectable, ForbiddenException } from '@nestjs/common';
import * as appleSignin from 'apple-signin';
import { AppleSignIn } from 'apple-sign-in-rest';
import path = require('path');

@Injectable()
export class AppleService {
  clientID = process.env.APPLE_AUTH_CLIENT_ID;
  teamID = process.env.APPLE_AUTH_TEAM_ID;
  keyID = process.env.APPLE_AUTH_KEY_ID;
  callbackURL = process.env.APPLE_AUTH_CALLBACK_URL;
  // privteKeyEnv = process.env.PRIVATE_KEY;
  privateKeyPath = process.env.PRIVATE_KEY_PATH;

  async verifyUser(payload: any): Promise<any> {
    console.log(payload);
    const appleSignIn = new AppleSignIn({
      clientId: process.env.APPLE_AUTH_CLIENT_ID,
      teamId: process.env.APPLE_AUTH_TEAM_ID,
      keyIdentifier: process.env.APPLE_AUTH_KEY_ID,
      privateKey: process.env.PRIVATE_KEY_PATH,
    });
    console.log(appleSignIn);

    const authorizationUrl = appleSignIn.getAuthorizationUrl({
      scope: ['name', 'email'],
      redirectUri: 'http://localhost:3000/auth/apple/callback',
      state: '123',
      nonce: 'insert-generated-uuid',
    });
    console.log(authorizationUrl);

    // if (!tokens.id_token) {
    //   console.log('id_token이 존재 하지 않습니다.');
    //   throw new ForbiddenException();
    // }

    // console.log('tokens : ', tokens);

    // // TODO: AFTER THE FIRST LOGIN APPLE WON'T SEND THE USERDATA ( FIRST NAME AND LASTNAME, ETC.) THIS SHOULD BE SAVED ANYWHERE

    // const data = await appleSignin.verifyIdToken(tokens.id_token);
    // console.log('data : ', data);
    // return { data, tokens };

    const claim = await appleSignIn.verifyIdToken(payload, {
      nonce: 'nonce',
      subject: payload,
      ignoreExpiration: true,
    });

    console.log(claim);
  }
}
