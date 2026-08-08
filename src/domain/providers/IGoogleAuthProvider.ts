export interface GoogleUserPayload {
  googleAccountId: string; // 'sub' do Google
  email: string;
  emailVerificado: boolean;
  nome: string;
  avatarUrl?: string;
}

export interface IGoogleAuthProvider {
  verifyIdToken(idToken: string): Promise<GoogleUserPayload>;
}