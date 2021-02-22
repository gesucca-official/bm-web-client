const express = require('express');

const app = express();
app.use(express.static('./dist/bm-web-client'));
app.listen(process.env.PORT || 8080)
