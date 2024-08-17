import express, { Request, Response, NextFunction } from "express";
import useragent from "express-useragent"
import cookieParser from "cookie-parser";
import morgan from "morgan";

const App = (app: any): void => {

    app.use(useragent.express());
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan('dev'));

    app.use((req: Request, res: Response, next: NextFunction): void => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Acceppt, Authorization'
        );
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', ' GET, POST, PUT, PATCH, DELETE ');
            res.status(200).json({});
        };
        next();
    });
    // app.use(cors({
    //     origin: ['https://yourdomain.com'],
    //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    //     allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    // }));
};

export default App;