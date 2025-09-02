export class FavoriteEntity {
 constructor(
   public user_id: string,
   public service_id: string,
   public created_at: Date,
 ) {}
}