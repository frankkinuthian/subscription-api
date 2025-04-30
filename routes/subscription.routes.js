import { Router } from 'express'
import authorize from "../middlewares/auth.middleware.js";
import {createSubscription, getUserSubscriptions, getAllSubscriptions, getSubscriptionDetails, updateSubscription, deleteSubscription, cancelSubscription, getUpcomingRenewals} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

// More specific routes first
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// General routes
subscriptionRouter.get('/', authorize, getAllSubscriptions);
subscriptionRouter.post('/', authorize, createSubscription);

// Dynamic routes
subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// User-specific dynamic route
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;