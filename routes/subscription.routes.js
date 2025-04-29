import { Router } from 'express'
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription, getUserSubscriptions} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => res.send({ title: "GET all subscriptions" }))

subscriptionRouter.get('/:id', (req, res) => res.send({ title: "GET subcription details" }))

subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id', (req, res) => res.send({ title: "UPDATE all subscriptions" }))

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: "DELETE a subscription" }))

subscriptionRouter.get('/user/:id', getUserSubscriptions)

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: "CANCEL a user subscription" }))

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: "GET upcoming subscriptions" }))

export default subscriptionRouter