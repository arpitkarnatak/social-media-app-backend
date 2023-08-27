"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/ConfigVars");
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ConfigVars_1 = require("./config/ConfigVars");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [ConfigVars_1.FRONTEND_URL],
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: ConfigVars_1.COOKIES_SECRET,
    saveUninitialized: false,
    resave: true,
    proxy: true,
    name: 'connect.sid',
    cookie: process.env.NODE_ENV
        ? {
            sameSite: "none",
            secure: true,
            domain: `${ConfigVars_1.BACKEND_URL.replace("https://", "")}`,
        }
        : {},
}));
app.use(passport_1.default.session());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ message: "Hello" });
}));
app.use(routes_1.endpoints);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
