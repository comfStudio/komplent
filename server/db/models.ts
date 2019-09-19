import mongoose, { Document } from 'mongoose'

import { is_server } from '@utility/misc'

import { user_schema, profile_schema, store_schema,
        commission_stats_schema, gallery_schema,
        user_options_schema,
        IUser, IUserModel } from '@schema/user'

import { message_schema, conversation_schema } from '@schema/message'
import { image_schema, attachment_schema } from '@schema/general'
import { commission_schema, commission_extra_option_schema, comission_rate_schema } from '@schema/commission'

export const User = is_server() ? mongoose.models.User as IUserModel || mongoose.model<IUser, IUserModel>('User', user_schema) : undefined
export const UserStore = is_server() ? mongoose.models.UserStore || mongoose.model<Document>('UserStore', store_schema) : undefined
export const Profile = is_server() ? mongoose.models.Profile || mongoose.model<Document>('Profile', profile_schema) : undefined
export const CommissionStats = is_server() ? mongoose.models.CommissionStats || mongoose.model<Document>('CommissionStats', commission_stats_schema) : undefined
export const CommissionRate = is_server() ? mongoose.models.CommissionRate || mongoose.model<Document>('CommissionRate', comission_rate_schema) : undefined
export const CommissionExtraOptions = is_server() ? mongoose.models.CommissionExtraOptions || mongoose.model<Document>('CommissionExtraOptions', commission_extra_option_schema) : undefined
export const Gallery = is_server() ? mongoose.models.Gallery || mongoose.model<Document>('Gallery', gallery_schema) : undefined
export const UserOptions = is_server() ? mongoose.models.UserOptions || mongoose.model<Document>('UserOptions', user_options_schema) : undefined

export const Message = is_server() ? mongoose.models.Message || mongoose.model('Message', message_schema) : undefined
export const Conversation = is_server() ? mongoose.models.Conversation || mongoose.model<Document>('Conversation', conversation_schema) : undefined

export const Image = is_server() ? mongoose.models.Image || mongoose.model<Document>('Image', image_schema) : undefined
export const Attachment = is_server() ? mongoose.models.Attachment || mongoose.model<Document>('Attachment', attachment_schema) : undefined

export const Commission = is_server() ? mongoose.models.Commission || mongoose.model<Document>('Commission', commission_schema) : undefined