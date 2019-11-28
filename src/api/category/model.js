import mongoose, { Schema } from 'mongoose'

const type = ['income', 'expense']

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: type
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

categorySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      type: this.type,
      // user: this.user.view(full),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Category', categorySchema)

export const schema = model.schema
export default model
