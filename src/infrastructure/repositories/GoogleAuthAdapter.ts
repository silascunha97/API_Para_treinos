import { OAuth2Client } from 'google-auth-library';
import { IGoogleAuthProvider, GoogleUserPayload } from '../../domain/providers/IGoogleAuthProvider';

export class GoogleAuthAdapter implements IGoogleAuthProvider {
  private client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(this.clientId);
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      throw new Error('Token do Google inválido ou sem informações essenciais.');
    }

    return {
      googleAccountId: payload.sub,
      email: payload.email,
      emailVerificado: payload.email_verified ?? false,
      nome: (payload.name || payload.email.split('@')[0]) as string,
      avatarUrl: payload.picture ?? '', // Ensure avatarUrl is always a string, defaulting to empty if undefined or null
    };
  }
}