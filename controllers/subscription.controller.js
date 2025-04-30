import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in the token
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({});
        res.status(200).json({ success: true, data: subscriptions });
    } catch (e) {
        next(e);
    }
};

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (e) {
        next(e);
    }
};

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: subscription });
    } catch (e) {
        next(e);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { endDate } = req.query;

        let query = {
            user: userId,
            renewalDate: { $gte: new Date() },
            status: 'active'
        };

        if (endDate) {
            // Ensure endDate is a valid Date object
            const endDateTime = new Date(endDate);
            if (!isNaN(endDateTime.getTime())) {
                query.renewalDate.$lte = endDateTime;
            } else {
                // Handle invalid date format if necessary, or just ignore
                console.warn("Invalid endDate provided:", endDate);
            }
        }

        const upcomingRenewals = await Subscription.find(query).sort({ renewalDate: 1 });
        res.status(200).json({ success: true, data: upcomingRenewals });
    } catch (e) {
        next(e);
    }
};

