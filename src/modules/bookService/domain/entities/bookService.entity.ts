export class BookServiceEntity {
  constructor(
    public id: string,
    public service_id: string,
    public user_id: string,
    public service_name: string,
    public date_time: Date,
    public address: string,
    public comments: string | null,
    public responsible_name: string,
    public phone_number: string,
    public status: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}

