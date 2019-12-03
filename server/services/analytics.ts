import mongoose from 'mongoose'
import { Commission } from "@db/models"

const { ObjectId, Decimal128 } = mongoose.Types

export const get_commissions_count = async (user, since: Date, page = 0, limit = 30) => {
    const offset = page * limit

    let comms = await Commission.aggregate([
        {$project: {
            to_user: "$to_user",
            date: "$created",
            rate: "$rate.title",
            accepted: "$accepted",
            finished: "$finished"
        }},
        {$sort: { date : -1} },
        {$match: {
            accepted: true,
            finished: true,
            to_user: ObjectId(user._id),
            date: {$gte: since},
        }},
        {$limit: limit},
        {$skip: offset},
        {$group: {
            _id: { rate: "$rate", year: { '$year': "$date" }, month: { '$month': "$date" }, day: { '$dayOfMonth': "$date" } },
            count:{$sum: 1},
            rate: { $first: "$rate" },
        }},
        {$project: {
            day: "$_id.day",
            count: "$count",
            rate: "$rate",
        }},
        {$unset: ["_id"]},
    ])

    return comms
}

export const get_commissions = async (user, since: Date, page = 0, limit = 30) => {
    const offset = page * limit
    let comms = await Commission.aggregate([
        {$project: {
            to_user: "$to_user",
            date: "$created",
            payments: "$payments",
            rate: "$rate.title",
            // rate: {$ifNull: ["$to_title", "$from_title"]},
            accepted: "$accepted",
            finished: "$finished"
        }},
        {$match: {
            accepted: true,
            finished: true,
            to_user: ObjectId(user._id),
            date: {$gte: since},
        }},
        {$sort: { date : -1} },
        {$limit: limit},
        {$skip: offset},
        // Unwind the source
        {$unwind: "$payments"},
        // Do the lookup matching
        {$lookup: {
            from: "payments",
            localField: "payments",
            foreignField: "_id",
            as: "payment_objects"
            }
        },
        // Unwind the result arrays ( likely one or none )
        {$unwind: "$payment_objects"},
        // Group back to arrays
        {$group: {
            _id: "$_id",
            price: { $sum: {$cond: [{$eq: ["$payment_objects.status", "completed"]}, "$payment_objects.price", 0]} },
            refunded: { $sum: {$cond: [{$eq: ["$payment_objects.status", "refunded"]}, "$payment_objects.price", 0]} },
            date: { $first: "$date" }, 
            to_user: { $first: "$to_user" }, 
            rate: { $first: "$rate" }   
        }},
        {$unset: ["payments"]},
    ])
    return comms
}


export const get_commissions_earnings = async (user, since: Date, page = 0, limit = 30) => {
    const offset = page * limit

    let comms = await Commission.aggregate([
        {$project: {
            to_user: "$to_user",
            date: "$created",
            rate: "$rate.title",
            accepted: "$accepted",
            finished: "$finished",
            payments: "$payments",
        }},
        {$match: {
            accepted: true,
            finished: true,
            to_user: ObjectId(user._id),
            date: {$gte: since},
        }},
        {$sort: { date : -1} },
        {$limit: limit},
        {$skip: offset},
        // Unwind the source
        {$unwind: "$payments"},
        // Do the lookup matching
        {$lookup: {
            from: "payments",
            localField: "payments",
            foreignField: "_id",
            as: "payment_objects"
            }
        },
        // Unwind the result arrays ( likely one or none )
        {$unwind: "$payment_objects"},
        // Group back to arrays
        {$group: {
            _id: { rate: "$rate" },
            earned: { $sum: {$cond: [{$eq: ["$payment_objects.status", "completed"]}, "$payment_objects.price", 0]} },
            rate: { $first: "$rate" },
        }},
        {$project: {
            earned: "$earned",
            rate: "$rate",
        }},
        {$unset: ["_id"]},
    ])

    return comms
}

export const get_earnings = async (user, since: Date) => {
    let earned = await Commission.aggregate([
        {$project: {
            to_user: "$to_user",
            date: "$created",
            accepted: "$accepted",
            finished: "$finished",
            payments: "$payments",
        }},
        {$match: {
            accepted: true,
            finished: true,
            to_user: ObjectId(user._id),
            date: {$gte: since},
        }},
        {$sort: { date : -1} },
        // Unwind the source
        {$unwind: "$payments"},
        // Do the lookup matching
        {$lookup: {
            from: "payments",
            localField: "payments",
            foreignField: "_id",
            as: "payment_objects"
            }
        },
        // Unwind the result arrays ( likely one or none )
        {$unwind: "$payment_objects"},
        // Group back to arrays
        {$group: {
            _id: null,
            earned: { $sum: {$cond: [{$eq: ["$payment_objects.status", "completed"]}, "$payment_objects.price", 0]} },
        }},
        {$unset: ["_id"]},
    ])

    if (earned && earned.length) {
        earned = earned[0]
    }

    return earned
}

