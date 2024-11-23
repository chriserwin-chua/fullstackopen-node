const express = require('express');
const app = express();
const cors = require('cors');
const { PORT, MONGODB_URI } = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

logger.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
