import { Conversation, Follow, Commission, User } from "@db/models"

export const create_conversation = async (from_user, data: any) => {

    const user_id = data?.users?.filter(v => v !== from_user._id.toString())?.[0]

    const user = await User.findById(user_id).select("messages_from type").lean()

    if (user.type === 'creator') {
        
        if (user.messages_from === 'commissioners' || user.messages_from === 'followers') {
            const c = await Commission.find({from_user: from_user._id, to_user: user._id}).countDocuments()
            if (!c && user.messages_from === 'commissioners') {
                throw Error("user only receives messages from commissioners")
            }
        }

        if (user.messages_from === 'followers') {
            const f = await Follow.findOne({follower: from_user._id, followee: user._id, end: null}).countDocuments()
            if (!f) {
                throw Error("user only receives messages from followers")
            }
        }

    }

    const c = new Conversation(data)

    await c.save()

    return c
}