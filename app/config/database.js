require('dotenv').config()

module.exports = {
  dialect: process.env.ENV_DATABASE_DIALECT,
  host: process.env.ENV_DATABASE_HOST,
  username: process.env.ENV_DATABASE_USERNAME,
  password: process.env.ENV_DATABASE_PASSWORD,
  database: process.env.ENV_DATABASE_DATABASE,
  define: {
    timestamps: true,
    underscored: true,
  }
}