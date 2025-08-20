export class User {
  constructor(
    public readonly id: string,
    public readonly firebaseUid: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly displayName: string,
    public readonly role: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}