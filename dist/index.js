"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_redis_cache_1 = __importDefault(require("express-redis-cache"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = process.env.PORT || 9000;
var client1 = (0, express_redis_cache_1.default)({ host: "127.0.0.1", port: "6379" });
app.get('/', function (req, res, next) {
    // set cache name
    res.express_redis_cache_name = 'todos';
    next();
}, client1.route(), // cache entry name is `cache.prefix + "/"`
async function (req, res) {
    const data = await axios_1.default.get('https://jsonplaceholder.typicode.com/posts');
    res.send(data.data);
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
