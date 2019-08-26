import mongoose from 'mongoose'

import { user_schema, profile_schema,
        commission_stats_schema, gallery_schema,
        user_options_schema, comission_rate_schema } from '@app/server/db/schema/user'

export const User = mongoose.model('User', user_schema);
export const Profile = mongoose.model('Profile', profile_schema);
export const CommissionStats = mongoose.model('CommissionStats', commission_stats_schema);
export const CommissionRate = mongoose.model('CommissionRate', comission_rate_schema);
export const Gallery = mongoose.model('Gallery', gallery_schema);
export const UserOptions = mongoose.model('UserOptions', user_options_schema);