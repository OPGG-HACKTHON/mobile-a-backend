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
    const client = new OAuth2Client(clientID);

    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret,
      clientRedirectUrl,
    );
    this.client = new OAuth2Client();
  }

  async verify(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
  }

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
