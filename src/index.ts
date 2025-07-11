import { routes } from "./routes";
import Express from "express";
import database from "./infra/config/config.database";
import "dotenv/config";
import cors from 'cors';

const app = Express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

routes(app);

export default class Application {
  private database = database();

  public async initialize(): Promise<void> {
    console.info("Starting the application...");
    await this.connectDatabase();
    this.startServer();
  }

  private async connectDatabase(): Promise<void> {
    console.info("Connecting to the database...");
    this.database;
  }

  private startServer(): void {
    console.info("Starting the Http Server...");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.info(`Server starter on port ${PORT}`);
    });
  }
}

const application = new Application();

application.initialize().catch((error: any) => {
  console.error("Unhandled error during initialization:", error.stack);
  process.exit(1);
});
