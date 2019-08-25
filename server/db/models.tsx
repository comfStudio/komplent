import mongoose from 'mongoose'

import blogSchema from '@schema/blog'

export const Blog = mongoose.model('Blog', blogSchema);