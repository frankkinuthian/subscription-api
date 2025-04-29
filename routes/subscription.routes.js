import { Router } from 'express'

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => res.send({ title: "GET all subscriptions" }))

subscriptionRouter.get('/:id', (req, res) => res.send({ title: "GET subcription details" }))

subscriptionRouter.post('/', (req, res) => res.send({ title: "CREATE all subscriptions" }))

subscriptionRouter.put('/:id', (req, res) => res.send({ title: "UPDATE all subscriptions" }))

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: "DELETE a subscription" }))

subscriptionRouter.get('/user/:id', (req, res) => res.send({ title: "GET all user subscriptions" }))

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: "CANCEL a user subscription" }))

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: "GET upcoming subscriptions" }))

export default subscriptionRouter