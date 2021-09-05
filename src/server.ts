import App from './app';
import PositionController from './position/position.controller'


const app = new App([new PositionController()])

app.listen();

