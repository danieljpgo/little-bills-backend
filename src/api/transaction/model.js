import mongoose, { Schema } from 'mongoose'

const transactionSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  wallet: {
    type: Schema.ObjectId,
    ref: 'Wallet',
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  value: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

transactionSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      wallet: this.wallet.view(full),
      category: this.category.view(full),
      value: this.value,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Transaction', transactionSchema)

export const schema = model.schema
export default model
