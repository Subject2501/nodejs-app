const mongoose = require('mongoose');
const User = require('./user');


const currentDate = function(){
    var date = new Date();
    mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
    
};

const blogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: String,
    body: {
        type: String,
        required: true,
        trim: true
    },
    urlExt: String,
    date: {
        type: String,
        default: currentDate()
    },
    comments:[
        {   
            _id: {
                type: mongoose.Types.ObjectId
            },
            user: {
                name: String,
                email: String,
            },
            message: {
                type: String,
                required: true,
                trim: true
            },
            date: {
                type: Date,
            },
            replies:[{
                _id: {
                    type: mongoose.Types.ObjectId
                },
                reply:
                    {type: String},
                user: {
                    name: String,
                    email: String
                },
                date: {
                    type: Date,
                }
            }]
        }

    ]
})

blogSchema.methods.addComment = function(comment, user){
    const updatedComments = [...this.comments];
    updatedComments.push({
        _id: mongoose.Types.ObjectId(),
        message: comment,
        user: user,
        date: currentDate()
    });
    this.comments = updatedComments;
    return this.save();
};

blogSchema.methods.addReply = function(commentid, reply, user){
    const index  = this.comments.findIndex(comment => {
        return comment._id == commentid;
    })
    const updatedComments = [...this.comments]
    updatedComments[index].replies.push({
        _id: mongoose.Types.ObjectId(),
        reply: reply,
        user: user,
        date: currentDate()
    })
    this.comments = updatedComments;
    return this.save()
};

blogSchema.methods.deleteComment = function(commentid){
    const updatedComments = [];
    const currentComments = [...this.comments];
    currentComments.map((comment) => {
        if (comment._id == commentid){
            return false
        }
        updatedComments.push(comment);
    })
    this.comments = updatedComments;
    return this.save();
}

blogSchema.methods.deleteReply = function(replyid){
    const replyIndex  = this.comments.map(comment => {
        return comment.replies.findIndex(reply => {
            return reply._id == replyid;
        })
    })

    const messageIndex = this.comments.findIndex(comment => {
        return replyIndex == comment.replies.findIndex(reply => {
            return reply._id == replyid;
        })
    })
    const currentComments = [...this.comments]
    const updatedReplies = [];
    currentComments[messageIndex].replies.map((reply)=>{
        if (reply._id == replyid){
            return false
        }
        updatedReplies.push(reply);
    })
    
    this.comments[messageIndex].replies = updatedReplies;
    return this.save()
    
}

module.exports = mongoose.model('Blog', blogSchema);