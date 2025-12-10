require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./config/db');
const healthRoute = require('./routes/health');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoute);

app.get('/', (req, res) => res.send('Job Board Platform is running'));

const PORT = process.env.PORT || 5000;
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
})();
