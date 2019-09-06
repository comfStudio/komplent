import mongoose from 'mongoose'

import { user_schema, profile_schema,
        commission_stats_schema, gallery_schema,
        user_options_schema, comission_rate_schema } from '@schema/user'

import { message_schema, conversation_schema } from '@schema/message'
import { image_schema, attachment_schema } from '@schema/general'
import { commission_schema, commission_options_schema } from '@schema/commission'

export const User = mongoose.model('User', user_schema);
export const Profile = mongoose.model('Profile', profile_schema);
export const CommissionStats = mongoose.model('CommissionStats', commission_stats_schema);
export const CommissionRate = mongoose.model('CommissionRate', comission_rate_schema);
export const Gallery = mongoose.model('Gallery', gallery_schema);
export const UserOptions = mongoose.model('UserOptions', user_options_schema);

export const Message = mongoose.model('Message', message_schema)
export const Conversation = mongoose.model('Conversation', conversation_schema)

export const Image = mongoose.model('Image', image_schema)
export const Attachment = mongoose.model('Attachment', attachment_schema)

export const Commission = mongoose.model('Commission', commission_schema)
export const CommissionOptions = mongoose.model('CommissionOptions', commission_options_schema)