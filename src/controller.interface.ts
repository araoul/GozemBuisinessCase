import express from "express";

interface IController {
    router: express.Router,
    path: String
}

export default IController