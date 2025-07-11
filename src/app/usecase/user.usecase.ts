import { HashGenerator } from "../../utils/generate-hash";
import { UserService } from "../service/user.service";

export class UserUseCase {
  private service: UserService;
  private hashGenerator: HashGenerator;
  constructor() {
    this.service = new UserService();
    this.hashGenerator = new HashGenerator();
  }

  public async create(data: any) {
    const { password } = data;
    data.password = this.hashGenerator.generate(password);

    return await this.service.create(data);
  }

  public retriever = async () => await this.service.retriever();

  public retrieveById = async (id: string) =>
    await this.service.retrieveById(id);

  public async update(id: string, data: any) {
    const { password } = data;
    data.password = this.hashGenerator.generate(password);
    return await this.service.update(id, data);
  }

  public delete = async (id: string) => await this.service.delete(id);
}
