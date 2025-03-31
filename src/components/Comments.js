
export default function Comments({ comment, toSend, setToSend, handleSendComment, errMessage }) {
    return (
        <div className='comments'>
            <h4>{ comment.notesTitle || comment.randomNotes.notesTitle }</h4>
            {
                errMessage.error ? 
                <p style={{color: "red"}}>You have to be signed in!</p>
                : ''
            }
            <div className='comments-comment'>
            {

                comment.randomNotes ? 
                    !comment.randomNotes.comments ? 
                    <p>No comments available</p> :

                    comment.randomNotes.comments.map((comment) => {
                        return (
                        <div className='comment'>
                            <div className='comment-user'> { comment.user } </div>
                            <div className='comment-text'> { comment.comment } </div>
                        </div>
                        )
                    })
                : comment.projectName ?
                    !comment.comments ? 
                    <p>No comments available</p> :

                    comment.comments.map((comment) => {
                        return (
                        <div className='comment'>
                            <div className='comment-user'> { comment.user } </div>
                            <div className='comment-text'> { comment.comment } </div>
                        </div>
                        )
                    })
                : <p>No comments available</p>
            }
            </div>
            <label>
                <input type='text' value={toSend} onChange={(e) => setToSend(e.target.value)} placeholder='Add comment...' />
                <button className='comments-send' onClick={handleSendComment} ><i class="fa-regular fa-paper-plane"></i></button>
            </label>
        </div>
    )
}