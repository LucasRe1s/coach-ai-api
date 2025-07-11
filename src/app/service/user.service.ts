import { UserEntity } from "../../infra/database/entities/user";
import { UserProps } from "../../interface/user/user.schema";
export class UserService {
  private repository = UserEntity;
  constructor() {
    this.repository = UserEntity;
  }

  public create = async (data: UserProps): Promise<UserProps> =>
    await new this.repository(data).save();

  public retriever = async (): Promise<UserProps[]> =>
    await this.repository.find();

  public retrieveById = async (id: string): Promise<UserProps | null> =>
    await this.repository.findById(id);

  public async update(id: string, data: UserProps): Promise<void> {
    await this.repository.findOneAndUpdate({ _id: id }, { $set: data });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.deleteOne({ _id: id });
  }

  public async retrieveByEmail(email: string): Promise<UserProps | null> {
    return await this.repository.findOne({ email });
  }
}
