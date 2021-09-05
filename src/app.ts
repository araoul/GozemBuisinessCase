import express, {Application} from 'express';
import * as dotenv from 'dotenv';
import IController from './controller.interface';

dotenv.config();

class App {
    public app: Application;
    public port: number;

    constructor(controllers:IController[]) {
        this.app = express();
        this.port = +process.env.PORT;
        this.initialiserMidlleware();
        this.initialiserControllers(controllers);
    }


    private initialiserMidlleware() {
        this.app.use(express.json())
    }

    private initialiserControllers(controllers: IController[]) {
        controllers.forEach((controller: IController) => {
            this.app.use('/', controller.router)
        });
    }

    public listen() {
        this.app.listen(this.port, () => {console.log(`Server listen to ${this.port}`)})
    }

}

export default App;