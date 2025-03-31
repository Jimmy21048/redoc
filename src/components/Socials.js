import Header from './Header1';
import Search from './Search';
import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import Loading from './Loading';
import Comments from './Comments';

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
    const colors = [
        '#FF004F',
        '#FE0000',
        '#00B9E8',
        '#00BFFF',
        '#99FFFF',
        '#4B0082',
        '#000000',
        '#353839',
        '#013220',
        '#01796F'
    ]

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND}/socials`, {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(response => {
            if(response.data.notes) {
                for(let i = 0; i < response.data.notes.length; i++) {
                    if(response.data.notes[i].projects.notes) {
                        users.push(response.data.notes[i].username)
                        projects.push(response.data.notes[i].projects.projectName)
                        break1.push(response.data.notes[i].projects.notes)    
                    }
                }
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
    },[refresh])
    
    const handleComments = (data) => {
        setComment(data)
    }

    const handleSendComment = () => {
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

        axios.post(`${process.env.REACT_APP_BACKEND}/socials/comment`, data, {
            headers : {
                accessToken : localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            setRefresh(prev => !prev)
            if(response.data.success) {
                setToSend('')
                setComment({
                    ...comment,
                    comments: response.data.success[0].projects.notes.comments
                })
            }
            if(response.data.successRandoms) {
                setToSend('')
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
    function stripHTML(html) {
        return html
            .replace(/<br\s*\/?>/gi, "\n") 
            .replace(/<[^>]*>/g, "");  
    }

    return(
        <div className='socials'>
        {
            loading && <Loading />
        }
            <Header {...{showNote, setShowNote}} />
            <div className='socials-body'>
                <div className='socials-right'>
                {
                    showNote ? 
                    <div className='socials-note-main'>
                        <h2>{ note.notesTitle || note.randomNotes.notesTitle }</h2>
                        <div>
                        {   note.randomNotes &&
                            note.randomNotes.notesContent.map((item, index) => {
                                return <div key={index}>
                                    {
                                        item[1] === 'title' ? 
                                        <p className='text-title'>{ stripHTML(item[0]) }</p> : 
                                        item[1] === 'content' ? 
                                        <p className='text-paragraph'>{ stripHTML(item[0]) }</p> : 
                                        item[1] === 'code' && 
                                        <p className='text-code'>{ stripHTML(item[0]) }</p>
                                    }
                                </div>
                        })}
                        {   note.notesContent &&
                            note.notesContent.map((item, index) => {
                                return <>
                                    {
                                        item[1] === 'title' ? 
                                        <p className='text-title'>{ stripHTML(item[0]) }</p> : 
                                        item[1] === 'content' ? 
                                        <p className='text-paragraph'>{ stripHTML(item[0]) }</p> : 
                                        item[1] === 'code' ?
                                        <p className='text-code'>{ stripHTML(item[0]) }</p> : 
                                        item[1] === 'image' && 
                                        <img src={item[0]} className='ed-image' alt='image-item' />
                                    }
                                </>
                        })}
                        {
                            comment && <Comments {...{comment, toSend, setToSend, handleSendComment, errMessage}} />
                        }
                        </div>
                    </div>
                    :
                    <div className='socials-right-notes'>
                        <h2>OPEN ACCESS NOTES</h2>
                    {
                        notes1.map((note) => {
                            return (
                                <div key={note.notesTitle}  onClick={() =>{handleClickNote(note); handleComments(note)}}  className='socials-note'>
                                    <div className='socials-note-profile'><p style={{backgroundColor: `${colors[Math.floor(Math.random() * (9-0 +1) + 0)]}`}} >{note.username[0].toUpperCase()}</p>  <p>{note.username}</p> <p className='socials-note-date'>{ note.notesDate }</p></div>
                                    <h3 className='socials-note-header'> {note.notesTitle.toUpperCase()} </h3>
                                    <div className='socials-note-body'  contentEditable = "false">
                                        { note.catchPhrase }
                                    </div>
                                    <div className='socials-note-footer'>
                                        <button onClick={() => handleComments(note)}><i class="fa-regular fa-comment"></i></button>
                                        <button onClick={() =>{handleClickNote(note); handleComments(note)}} >Read post...</button>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }
                    {
                        notes2.map((note) => {
                            return (
                                <div key={note.randomNotes.notesTitle}  onClick={() =>handleClickNote(note)}  className='socials-note'>
                                    <div className='socials-note-profile'><p style={{backgroundColor: `${colors[Math.floor(Math.random() * (9-0 +1) + 0)]}`}} >{note.username[0].toUpperCase()}</p>  <p>{note.username}</p> <p className='socials-note-date'>{ note.randomNotes.notesDate }</p></div>
                                    <h3 className='socials-note-header'> {note.randomNotes.notesTitle.toUpperCase()} </h3>
                                    <div className='socials-note-body'  contentEditable ="false">
                                        { note.randomNotes.catchPhrase }
                                    </div>
                                    <div className='socials-note-footer'>
                                        <button onClick={() => handleComments(note)}><i class="fa-regular fa-comment"></i></button>
                                        <button onClick={() =>handleClickNote(note)}  >Read post...</button>
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
                                <label htmlFor='menu' className='menu-label'>X</label>
                                { note.projectName ? <h3>Project : {note.projectName} </h3>: '' }
                                <button onClick={() => setShowNote(false)}>Back</button>
                            </div>
                            :<Search {...{notes1, notes2, setNotes1, setNotes2}} unit = "projectNotes" />
                        }
                        
                    </nav>
                    <h3 className='rev-h3'>Reviews</h3>
                    <div className='comments-body'>
                    {
                        comment ? 
                        <Comments {...{comment, toSend, setToSend, handleSendComment, errMessage}} />
                        : <p className='no-comment'>Click on an article</p>
                    }
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default Socials;