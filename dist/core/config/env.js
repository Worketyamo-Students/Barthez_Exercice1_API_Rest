"use strict";
// src/core/config/env.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONNECTION_STRING = exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)('PORT').required().asPortNumber(),
    API_PREFIX: (0, env_var_1.get)('DEFAULT_API_PREFIX').default('/api/v1').asString(),
    NODE_ENV: (0, env_var_1.get)('NODE_ENV').default('development').asString(),
    MONGO_INITDB_ROOT_USERNAME: (0, env_var_1.get)('MONGO_INITDB_ROOT_USERNAME').default('admin').asString(),
    MONGO_INITDB_ROOT_PASSWORD: (0, env_var_1.get)('MONGO_INITDB_ROOT_PASSWORD').default('test123').asString(),
    MONGO_DB_NAME: (0, env_var_1.get)('MONGO_DB_NAME').default('worketyamo').asString()
};
exports.CONNECTION_STRING = `mongodb://${exports.envs.MONGO_INITDB_ROOT_USERNAME}:${exports.envs.MONGO_INITDB_ROOT_PASSWORD}@172.28.0.2:27017/${exports.envs.MONGO_DB_NAME}?authSource=admin`;
//# sourceMappingURL=env.js.map