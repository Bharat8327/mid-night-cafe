const config = {
  app: {
    PORT: process.env.PORT,
  },
  db: {
    MONOGODB_URI: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export default config;
