import { cartRouter } from "./carts/cart.routes";
import { productRoute } from "./products/products.routes";
import { engine } from "express-handlebars";
import path = require("path");
import express, { Request, Response } from "express";
import { AppController } from "./app.controller";
import { appRoutes } from "./app.routes";
import http from "http";
import { Server } from "socket.io";
import Session from "express-session"
import MongoDBStore from "connect-mongodb-session"
import { authRouter } from "./auth/auth.routes";
declare module 'express-session' {
    interface SessionData {   
      user: string;
      role:string;
    }
  }
const connectionString="mongodb+srv://dcsweb:adrian123@dcsweb.snm3hyr.mongodb.net/"
const store =  MongoDBStore(Session)
const session =Session({
  resave:true,saveUninitialized:false,
  secret:"some pass",cookie:{maxAge:1000*60*60*24},store: new store({uri:connectionString,collection:"My Sessions"})})


const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer); // <- Aquí creamos el servidor de Socket.io

const appController = new AppController();
app.use(express.static('src/public'));
app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const PORT = 8080;
app.use(session)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appRoutes);
app.use("/api/", productRoute);
app.use("/api/carts", cartRouter);
app.use("/auth",authRouter)
app.use(appController.getAllProducts);

io.on('connection', (socket) => { // <- Aquí manejamos las conexiones
    console.log('a user connected');
});

httpServer.listen(PORT, () => console.log(`Connected to port ${PORT}`));


// import { cartRouter } from "./carts/cart.routes";
// import { productRoute } from "./products/products.routes";
// import { engine } from "express-handlebars";
// import { Server } from "socket.io";
// import path = require("path");
// import express, { Request, Response } from "express"
// import { AppController } from "./app.controller";
// import { appRoutes } from "./app.routes";
// import http from "http";

// const app = express();
// export const httpServer = http.createServer(app)

// const appController = new AppController()
// app.use(express.static('src/public'))
// app.engine("handlebars", engine())
// app.set('view engine', 'handlebars')
// app.set('views', './views')
// const PORT = 8080
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(appRoutes)
// app.use("/api/", productRoute)
// app.use("/api/carts", cartRouter)
// app.use(appController.getAllProducts)
// httpServer.listen(PORT, () => console.log(`Connected to port ${PORT}`))
