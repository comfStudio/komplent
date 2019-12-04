import { STATES } from "@server/constants"
import { User, Conversation, Message, Commission } from "@db/models"


export const synchronize_indexes = async () => {
    if (STATES.ES_SETUP) {
        User.synchronize()
        Conversation.synchronize()
        Message.synchronize()
        Commission.synchronize()
    }
}