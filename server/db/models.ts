import mongoose, { Document } from 'mongoose'

import { user_schema, profile_schema,
        commission_stats_schema, gallery_schema,
        user_options_schema, comission_rate_schema,
        IUser } from '@schema/user'

import { message_schema, conversation_schema } from '@schema/message'
import { image_schema, attachment_schema } from '@schema/general'
import { commission_schema, commission_options_schema } from '@schema/commission'

export const User = mongoose.models.User || mongoose.model<IUser>('User', user_schema);
export const Profile = mongoose.models.Profile || mongoose.model<Document>('Profile', profile_schema);
export const CommissionStats = mongoose.models.CommissionStats || mongoose.model<Document>('CommissionStats', commission_stats_schema);
export const CommissionRate = mongoose.models.CommissionRate || mongoose.model<Document>('CommissionRate', comission_rate_schema);
export const Gallery = mongoose.models.Gallery || mongoose.model<Document>('Gallery', gallery_schema);
export const UserOptions = mongoose.models.UserOptions || mongoose.model<Document>('UserOptions', user_options_schema);

export const Message = mongoose.models.Message || mongoose.model('Message', message_schema)
export const Conversation = mongoose.models.Conversation || mongoose.model<Document>('Conversation', conversation_schema)

export const Image = mongoose.models.Image || mongoose.model<Document>('Image', image_schema)
export const Attachment = mongoose.models.Attachment || mongoose.model<Document>('Attachment', attachment_schema)

export const Commission = mongoose.models.Commission || mongoose.model<Document>('Commission', commission_schema)
export const CommissionOptions = mongoose.models.CommissionOptions || mongoose.model<Document>('CommissionOptions', commission_options_schema)