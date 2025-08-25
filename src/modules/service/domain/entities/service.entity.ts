export class ServiceEntity {
  constructor(
    public id: string,
    public user_id: string,
    public title: string,
    public description: string,
    public base_price_cents: number | null,
    public currency: string,
    public status: string,
    public location_city: string | null,
    public lat: number | null,
    public lon: number | null,
    public cover_media_id: string | null,
    public coverMedia: { id: string; url: string },
    public categories: string[],
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
