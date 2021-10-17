const http = require("http");
const app = require("./app");

const port = process.env.PORT || 7001;

const server = http.createServer(app);

server.listen(port, () => console.log(`Server is up on port ${port}`));
