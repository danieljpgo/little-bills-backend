import mongoose, { Schema } from 'mongoose'

const status = ['new', 'ongoing', 'done'] 

const goalsSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },  
  endTime: {
    type: Date,
    required: true
  },
  startValue: {
    type: Number,
    required: true
  },
  endValue: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'new',
    required: true,
    enum: status 
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

goalsSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      startTime: this.startTime,
      endTime: this.endTime,
      startValue: this.startValue,
      endValue: this.endValue,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Goals', goalsSchema)

export const schema = model.schema
export default model
