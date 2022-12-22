const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})