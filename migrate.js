import { Umzug } from 'umzug';
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import configJson from './config/config.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, 'migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize,
    ],
    pattern: /\.mjs$/,
  },
  storage: new Umzug.SequelizeStorage({ sequelize }),
});

umzug.up().then(() => {
  console.log('All migrations performed successfully');
  process.exit(0);
});
