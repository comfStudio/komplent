import mongoose from 'mongoose'

import { Follow, Commission } from "@db/models"

const { ObjectId, Decimal128 } = mongoose.Types


export const get_top_commissioners =  async(user_id, limit = 10) => {
    const data = await Follow.aggregate([
        {$project: {
            follower: "$follower",
            followee: "$followee",
            end: "$end",
        }},
        {$match: {
            followee: ObjectId(user_id),
            end: null,
        }},
        {$lookup: {
            from: "commissions",
            let: {
                t_user: "$followee",
                f_user: "$follower"
             },
             pipeline: [
                {
                   $match: {
                      $expr: {
                         $and: [
                            {
                               $eq: [
                                  "$to_user",
                                  "$$t_user"
                               ]
                            },
                            {
                               $eq: [
                                  "$from_user",
                                  "$$f_user"
                               ]
                            },
                            {
                                $eq: [
                                   "$completed",
                                   true
                                ]
                            }
                         ]
                      }
                   }
                }
             ],
             as: "commissions"
            }
        },
        {$group: {
            _id: "$follower",
            count: { $sum: { $size: "$commissions" } },
            follower: { $first: "$follower" }, 
        }},
        {$sort: { commissions : -1} },
        {$limit: limit},
       ])
   
    return data
}

export const get_commissions_count =  async(user_id, to_user_id) => {

   const data = await Commission.aggregate([
       {$project: {
            to_user: "$to_user",
            from_user: "$from_user",
            completed: "$completed",
       }},
       {$match: {
            to_user: ObjectId(to_user_id),
            from_user: ObjectId(user_id),
            completed: true,
       }},
       {$group: {
         _id: null,
         count:{$sum: 1},
      }},
      {$unset: ["_id"]},
      ])
  
   return data
}
