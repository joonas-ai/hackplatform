const mongoose = require('mongoose');

const RecruitmentActionSchema = new mongoose.Schema(
    {
        recruiter: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        organisation: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['favorite', 'remove-favorite', 'message', 'remind'],
            required: true
        },
        data: {
            type: mongoose.Mixed,
            default: {}
        }
    },
    { toJSON: { virtuals: true } }
);

RecruitmentActionSchema.virtual('_user', {
    ref: 'UserProfile', // The model to use
    localField: 'user', // Find people where `localField`
    foreignField: 'userId', // is equal to `foreignField`
    justOne: true
});

RecruitmentActionSchema.virtual('_recruiter', {
    ref: 'UserProfile', // The model to use
    localField: 'recruiter', // Find people where `localField`
    foreignField: 'userId', // is equal to `foreignField`
    justOne: true
});

RecruitmentActionSchema.set('timestamps', true);

const RecruitmentAction = mongoose.model('RecruitmentAction', RecruitmentActionSchema);

module.exports = { RecruitmentAction, RecruitmentActionSchema };
