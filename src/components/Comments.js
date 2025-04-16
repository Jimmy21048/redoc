
import styles from '../css/Comments.module.css'
export default function Comments({ comment, toSend, setToSend, handleSendComment, errMessage }) {
    return (
        <div className={ styles.comments }>
            <h4>{ comment.notesTitle || comment.randomNotes.notesTitle }</h4>
            {
                errMessage.error ? 
                <p style={{color: "red"}}>You have to be signed in!</p>
                : ''
            }
            <div className={ styles.commentsComment }>
            {

                comment.randomNotes ? 
                    !comment.randomNotes.comments ? 
                    <p>No comments available</p> :

                    comment.randomNotes.comments.map((comment) => {
                        return (
                        <div className={ styles.comment }>
                            <div className={ styles.commentUser }> { comment.user } </div>
                            <div className={ styles.commentText }> { comment.comment } </div>
                        </div>
                        )
                    })
                : comment.projectName ?
                    !comment.comments ? 
                    <p>No comments available</p> :

                    comment.comments.map((comment) => {
                        return (
                        <div className={ styles.comment }>
                            <div className={ styles.commentUser }> { comment.user } </div>
                            <div className={ styles.commentText }> { comment.comment } </div>
                        </div>
                        )
                    })
                : <p>No comments available</p>
            }
            </div>
            <label>
                <input type='text' value={toSend} onChange={(e) => setToSend(e.target.value)} placeholder='Add comment...' />
                <button className={ styles.commentsSend } onClick={handleSendComment} ><i class={`fa-regular fa-paper-plane ${styles.paperPlane}`}></i></button>
            </label>
        </div>
    )
}