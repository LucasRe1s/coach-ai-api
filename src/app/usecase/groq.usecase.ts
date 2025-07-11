
import { GroqService } from "../service/groq.service";

export class GroqUseCase {
    private service: GroqService;
    constructor () {
        this.service = new GroqService();
    }

    public async execute(query: string) {
        return await this.service.execute(query);
    }
}