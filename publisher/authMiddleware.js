const bodyParser = require('body-parser');
const cors = require('cors');

const configureMiddleware = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
};

module.exports = configureMiddleware;
