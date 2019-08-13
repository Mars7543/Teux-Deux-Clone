const express   = require('express');
const path      = require('path');
const port      = process.env.PORT || 3000;

// configure express
const app = express();
app.use(express.static(path.join(__dirname, '../public/dist')))

// start server
app.listen(port, () => console.log(`Server running on port ${port}...`))