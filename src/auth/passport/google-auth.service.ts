import { Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  client: OAuth2Client;

  constructor() {
    const clientID = process.env.GOOGLE_AUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_AUTH_SECRET;
    const clientRedirectUrl = process.env.GOOGLE_AUTH_CALLBACK_URL;

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret,
      clientRedirectUrl,
    );
    this.client = new OAuth2Client(clientID);
  }

  // new - id_token을 이용한 구글 유저 데이터
  async verify(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload;
  }

  // 기존의 accessToken을 이용한 구글 유저 데이터
  async getUser(accessToken: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: accessToken,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    console.log(userInfoResponse);

    return userInfoResponse.data;
  }
}
