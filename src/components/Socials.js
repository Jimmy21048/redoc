import Header from './Header1';
import Search from './Search';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Socials=()=>{
    const [notes2, setNotes2] = useState([]);
    const [notes1, setNotes1] = useState([]);
    const [comment, setComment] = useState();
    const [loading, setLoading] = useState(true)
    const [toSend, setToSend] = useState('');
    const [refresh, setRefresh] = useState(false)
    const [errMessage, setErrMessage] = useState('');
    const [note, setNote] = useState();
    const [showNote, setShowNote] = useState(false)
    let break1 = [];
    let break2 = [];
    let users = [];
    let projects = [];

    useEffect(() => {
        axios.get('http://localhost:3001/socials', {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(response => {
            // console.log(response)
            if(response.data.notes) {
                // console.log(response)
                for(let i = 0; i < response.data.notes.length; i++) {
                    if(response.data.notes[i].projects.notes) {
                        users.push(response.data.notes[i].username)
                        projects.push(response.data.notes[i].projects.projectName)
                        break1.push(response.data.notes[i].projects.notes)    
                    }
                }
                // console.log(break1, users)
                if(break1.length > 0) {
                    for(let j = 0; j < break1.length; j++) {
                        for(let k = 0; k < break1[j].length; k++) {
                            break1[j][k].username = users[j]
                            break1[j][k].projectName = projects[j]
                            break2.push(break1[j][k])
                        }
                    }
                }
                setNotes1(break2);
            }
            if(response.data.randomNotes) {
                setNotes2(response.data.randomNotes);
            }
            setLoading(false);
        })
    },[])
    
    const handleComments = (data) => {
        setComment(data)
    }

    const handleSendComment = () => {
        // console.log(toSend, comment)
        let data =[];

        if(comment.randomNotes) {
            data = {
                username: comment.username,
                notesTitle: comment.randomNotes.notesTitle,
                comment: toSend
            }
        } else {
            data = {
                username: comment.username,
                notesTitle: comment.notesTitle,
                projectName: comment.projectName,
                comment: toSend
            }
        }

        axios.post('http://localhost:3001/socials/comment', data, {
            headers : {
                accessToken : localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            
            if(response.data.success) {
                setToSend('')
                setComment({
                    ...comment,
                    comments: response.data.success[0].projects.notes.comments
                })
            }
            if(response.data.successRandoms) {
                setToSend('')
                console.log(comment)
                setComment({
                    ...comment,
                    randomNotes : {
                        ...comment.randomNotes,
                        comments : response.data.successRandoms[0].randomNotes.comments
                    }
                })
            }
            setErrMessage(response.data)
            setTimeout(() => {
                setErrMessage('')
            }, 5000)
        })
    }

    const handleClickNote = (note) => {
        setComment(note)
        setNote(note)
        setShowNote(true)
    }

    if(loading) {
        return <div>Loading...</div>
    }
    return(
        <div className='socials'>
            <Header/>
            <div className='socials-body'>
                <div className='socials-right'>
                {
                    showNote ? 
                    <div className='socials-note-main'>
                        <h2>{ note.notesTitle || note.randomNotes.notesTitle }</h2>
                        <p> { note.notesContent || note.randomNotes.notesContent } </p>
                    </div>
                    :
                    <div className='socials-right-notes'>
                        <h2>OPEN ACCESS NOTES</h2>
                    {
                        notes1.map((note) => {
                            return (
                                <div key={note.notesTitle}   className='socials-note'>
                                    <h3 className='socials-note-header'> {note.notesTitle.toUpperCase()} </h3>
                                    <div className='socials-note-body'>
                                        {note.notesContent}
                                    </div>
                                    <div className='socials-note-footer'>
                                        <div>{note.username} </div>
                                        <p>{ note.notesDate }</p>
                                        <button onClick={() => handleComments(note)}><i class="fa-regular fa-comment"></i></button>
                                        <button onClick={() =>handleClickNote(note)} >Read more...</button>
                                    </div>

                                </div>
                            )
                        })
                    }
                                    {
                        notes2.map((note) => {
                            return (
                                <div key={note.randomNotes.notesTitle}  className='socials-note'>
                                    <h3 className='socials-note-header'> {note.randomNotes.notesTitle.toUpperCase()} </h3>
                                    <div className='socials-note-body'>
                                        {note.randomNotes.notesContent}
                                    </div>
                                    <div className='socials-note-footer'>
                                        <div>{note.username} </div>
                                        <p>{ note.randomNotes.notesDate }</p>
                                        <button onClick={() => handleComments(note)}><i class="fa-regular fa-comment"></i></button>
                                        <button onClick={() =>handleClickNote(note)}  >Read more...</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                }
                </div>

                <div className='socials-right-comments'>
                    <nav className='socials-nav'>
                        {
                            showNote ?
                            <div className='socials-nav-notes'>
                                <h3>Author : { note.username }</h3>
                                { note.projectName ? <h3>Project : {note.projectName} </h3>: '' }
                                <button onClick={() => setShowNote(false)}>Back</button>
                            </div>
                            :<Search {...{notes1, notes2, setNotes1, setNotes2}} unit = "projectNotes" />
                        }
                        
                    </nav>
                    <h3>Reviews</h3>
                    <div className='comments-body'>
                    {
                        comment ? 
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
                        : <p className='no-comment'>Click on an article</p>
                    }
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default Socials;