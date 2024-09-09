import express from "express";
import Controller from "interfaces/controller.interface";
import { Pool } from "pg";
import bodyParser from "body-parser";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = Number(process.env.PORT);

    this.initializeControllers(controllers);
    this.initializeMiddlewares();
    this.connectToTheDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private async connectToTheDatabase() {
    const pool = new Pool({
      host: process.env.DB_HOST || "db",
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER || "sogan",
      password: process.env.DB_PASSWORD || "123456789",
      database: process.env.DB_NAME || "urlshortdb",
    });

    try {
      await pool.connect();
      console.log("Connection à la base de donnée réussie");
    } catch (error) {
      console.log("Erreur lors de la connexion à la base de donnée : ", error);
    } finally {
      await pool.end();
    }
  }
}

export default App;
