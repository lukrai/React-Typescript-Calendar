import * as express from "express";

class UserController {
    constructor() {
        console.log("Initialize user controller");
    }

    public getAllUsers = (request: express.Request, response: express.Response) => {
        return response.send({users: [{username: "username"}]});
    }

    public getUser = (request: express.Request, response: express.Response) => {
        return response.send({user: "user"});
    }

    public createUser = (request: express.Request, response: express.Response) => {
        const user = request.body;
        return response.send(user);
    }

    public updateUser = (request: express.Request, response: express.Response) => {
        const user = request.body;
        return response.send(user);
    }

    public deleteUser = (request: express.Request, response: express.Response) => {
        return response.send("ok");
    }
}

export default UserController;
