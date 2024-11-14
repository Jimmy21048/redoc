import Search from './Search'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';

const Account = () => {
    const { authState, setAuthState } = useContext(AuthContext)
    const [currentPage, setCurrentPage] = useState('my-works');
    const [data, setData] = useState('');
    const [projects, setProjects] = useState([]);
    const history = useNavigate();
    const [newProject, setNewProject] = useState(false);
    const [openProject, setOpenProject] = useState(false);
    const [openNote, setOpenNote] = useState(false);
    const [currentProject, setCurrentProject] = useState({});
    const [currentNote, setCurrentNote] = useState({});
    const [newNote, setNewNote] = useState(false);
    const [projectNote, setProjectNote] = useState('');
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectType: '',
        projectField: '',
    })
    const [notesData, setNotesData] = useState({
        notesTitle: '',
        attachProject: '',
        notesType: '',
        notesDate: new Date().toLocaleDateString()
    })
    const [projectResponse, setProjectResponse] = useState('');
    const [noteResponse, setNoteResponse] = useState('');
    const [updateNoteResponse, setUpdateNoteResponse] = useState('');
    const [notesText, setNotesText] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [randoms, setRandoms] = useState(false);
    const [randomNotes, setRandomNotes] = useState([]);
    const [projectMenu, setProjectMenu] = useState(false);
    const [toggleProject, setToggleProject] = useState(false);
    const [newFile, setNewFile] = useState(false);
    const [peerUsers, setPeerUsers] = useState([]);
    const [showPeerRequests, setShowPeerRequests] = useState(false);
    const [peerData, setPeerData] = useState([]);
    const [requestReview, setRequestReview] = useState(false)
    const [projectReview, setProjectReview] = useState('')
    const [reviewData, setReviewData] = useState({})
    const [fromReviews, setFromReviews] = useState(false)
    const [toReviews, setToReviews] = useState(false)
    const [showReviewFrom,setShowReviewFrom] = useState(false)
    const [showReviewTo,setShowReviewTo] = useState(false)
    const [reviewItem, setReviewItem] = useState([])
    const [reviewFeedBack, setreviewFeedBack] = useState('')
    const [reviewUser, setReviewUser] = useState({})
    const [reviewer, setReviewer] = useState({})
    // const titleRef = useRef(null)
    const imageRef = useRef(null)
    const [isDisabled, setIsDisabled] = useState(true)
    // const [title, setTitle] = useState('')
    // const [contentArea, setContentArea] = useState('')
    // const [codeArea, setCodeArea] = useState('')
    // const [divs, setDivs] = useState([])

    // // const titleBtn = document.getElementById('title')
    // // const body = document.querySelector('#hero')
    // const [showTitleInput, setShowTitleInput] = useState(false)
    // const [showTextArea, setShowTextArea] = useState(false)
    // const [showCode, setShowCode] = useState(false)
    // const [showImage, setShowImage] = useState(false)


        // const handleAddDiv = () => {
        //     const newDiv = (
        //         <div style={{ display: "flex", width: 'max-content' }}>
        //             <h3 contentEditable style={{ width: 'max-content', padding: '0 20px' }}>
        //                 {title}
        //             </h3>
        //         </div>
        //     )
        //     setDivs([...divs, newDiv])
        //     setTitle('')
        //     setShowTitleInput(false)
        // }

        // const handleAddContent = () => {
        //     const newDiv = <div dangerouslySetInnerHTML={{ __html: (contentArea || "").replace(/\n/g, '<br />') }} style={{ maxWidth: "700px", contentEditable: true, fontSize: '1.1rem' }} />
            
        //     setDivs([...divs, newDiv])
        //     setContentArea('')
        //     setShowTextArea(false)
        // }

        // const handleCode = () => {
        //     const newDiv = <div dangerouslySetInnerHTML={{ __html: (codeArea || "").replace(/\n/g, '<br />') }} style={{ borderLeft: '5px solid gray', contentEditable: true, padding: '15px', backgroundColor: '#F5F5F5' }} />
        //     setDivs([...divs, newDiv])
        //     setCodeArea('')
        //     setShowCode(false)
        // }

        // const handleTitleInput = (e) => {
        //     const input = e.target
        //     input.style.width = 'auto';
        //     input.style.width = `${input.scrollWidth}px`;
        //     setTitle(input.value);
        // }

        // const handleAreaInput = (e) => {
        //     const input = e.target

        //     input.style.height = 'auto'
        //     input.style.height = `${input.scrollHeight}px`
        //     setContentArea(input.value)
        // }

        // const handleCodeInput = (e) => {
        //     const input = e.target

        //     input.style.height = 'auto'
        //     input.style.height = `${input.scrollHeight}px`
        //     setCodeArea(input.value)
        // }

        // const handleSetImage = () => {
        //     // imageRef.current.click()
        // }

    //fetch data from db
    useEffect(() => {
        axios.get('http://localhost:3001/account/myaccount', {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then(response => {
            if(response.data.error) {
                setAuthState(false);
                history('/login');
                return
            } else {
                if(response.data.result.projects) {
                    setProjects(response.data.result.projects)
                }
                if(response.data.result.projects && openProject === true) {
                    
    
                    for(let i = 0; i <response.data.result.projects.length; i++) {
                        if(response.data.result.projects[i].projectName === currentNote.noteProject.projectName && response.data.projects[i].notes) {
                            for(let j = 0; j < response.data.result.projects[i].notes.length; j++) {
                                if(response.data.result.projects[i].notes[j].notesTitle === currentNote.note.notesTitle) {
                                    setCurrentNote({
                                        noteProject : response.data.result.projects[i],
                                        note : response.data.result.projects[i].notes[j]
                                    })
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    
                    // console.log(notesRef.current.innerHTML)
                    
                }
                if(response.data.result.randomNotes) {  
                    setRandomNotes(response.data.result.randomNotes)
                }
                setData(response.data.result)
                
                if(response.data.peers) {
                    setPeerUsers(response.data.peers)
                }
            }


            axios.get('http://localhost:3001/account/peers', {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                    "Content-Type" : "application/json"
                }
            }).then((response) => {
                console.log(response)
                if(response.data.error) {
                    setAuthState(false)
                    history('/login')
                    return
                }
                setPeerData(response.data[0])  
            })
        })

    },[refresh])

    const sendPeerRequest = (user) => {
        axios.post('http://localhost:3001/account/peerRequest', {user: user}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setProjectData({...projectData, [name] : value});
    }
    const handleChangeNotes = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setNotesData({...notesData, [name] : value})
    }

    const handleSubmitProject = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/account/newproject', projectData, {
            headers: {
                "Content-Type": "application/json",
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(response => {
            if(response.data.error) {
                history('/login');
            }
            setProjectResponse(response.data)
            if(response.data.success) {
                setProjects(response.data.projects)
                setNewProject(false);
                setCurrentPage('my-works')
                handleOpenProject(response.data.projects[response.data.projects.length - 1])
            }
            
            
            setTimeout(() => {
                setProjectResponse('');
            }, 5000)
        })
    }
    const handleOpenProject = (data) => {
        // setRefresh(prev => !prev)
        setCurrentProject(data);
        setOpenProject(true);
    }

    const handleCurrentPage = (page) => {
        setOpenProject(false);
        setOpenNote(false);
        setNewProject(false);
        setNewNote(false);
        setRandoms(false);
        setCurrentPage(page);
        setIsDisabled(true)
    }

    const handleSubmitNote = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/account/newnote', notesData, {
            headers : {
                "Content-Type" : "application/json",
                accessToken : localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setRefresh(prev => !prev);
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            if(response.data.success) {
                //check type of note
                if(response.data.myNotes.project) {
                    setCurrentNote({
                        noteProject : response.data.myNotes.project,
                        note: response.data.myNotes.note
                    })
                } else {
                    setCurrentNote({
                        note: response.data.myNotes.note
                    })
                }
                setNewNote(false);
                setCurrentPage('my-works')
                setOpenNote(true);
                setOpenProject(false)
                setNewProject(false);
            }
            setNoteResponse(response.data)

            setTimeout(() => {
                setNoteResponse('')
            }, 5000)
        })
    }

    const handleUpdateNotes = (data) => {
        console.log("yes im here")
        let notes = {};
        if(data.noteProject) {
            notes = {
                project : data.noteProject.projectName,
                notes : data.note.notesTitle,
                data : notesText
            }
        }
        else if(data.note) {
            notes = {
                project : '',
                notes : data.note.notesTitle,
                data : notesText
            }
        }
        
        axios.post('http://localhost:3001/account/updatenotes', notes, {
            headers : {
                "Content-Type" : "application/json",
                accessToken : localStorage.getItem("accessToken")
            }
        }).then((response) => {
            setRefresh(prev => !prev)
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setUpdateNoteResponse(response.data);
            setTimeout(() => {
                setUpdateNoteResponse('')
            }, 5000)
        })    
    }

    const handleOpenNote = (project, note)  => {
        if(project) {
            setCurrentNote({
                ...currentNote,
                note : note,
                noteProject: project
            })
        } else if (project === null) {
            setCurrentNote({
                note: note
            })
        }
        setOpenProject(false);
        setOpenNote(true);
    }

    const toggleProjectMenu = (name) => {
        setToggleProject(prev => !prev)
        setProjectMenu({
            projectName : name
        })
    }

    const handleProjectType = (name, type) => {
        axios.post('http://localhost:3001/account/projectType', {type: type, name: name}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }

    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState(false)
        history('/')
    }

    const handleAcceptPeer =(peer) => {
        axios.post('http://localhost:3001/account/acceptPeer', {peer: peer}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }

    const handleRejectPeer = (peer) => {
        axios.post('http://localhost:3001/account/rejectPeer', {peer: peer}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }

    const handleCancelPeer = (peer) => {
        axios.post('http://localhost:3001/account/cancelPeer', {peer: peer}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }

    const handleDeleteProject = (name) => {
        axios.post('http://localhost:3001/account/deleteProject', {name: name}, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setRefresh(prev => !prev)
        })
    }

    const handleRequestReview = (data) => {
        setProjectReview(data)
        setReviewData({...reviewData, projectName : data})
        setShowPeerRequests(false)
        setCurrentPage('peer-review')
        setRequestReview(true)
    }

    const handleChangeReview = (e) => {
        const name = e.target.name
        const value = e.target.value

        setReviewData({...reviewData, [name] : value})
    }

    const handleSubmitReviewRequest = (e) => {
        e.preventDefault()
        
        axios.post('http://localhost:3001/account/review', reviewData, {
            headers : {
                "Content-Type" : "application/json",
                accessToken : localStorage.getItem("accessToken")
            }
        }).then(response => {

            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            if(response.data.success) {
                setRefresh(prev => !prev)
                setRequestReview(false)
                setToReviews(true)
            }

        })
    }

    const handleReviewFrom = (data) => {
        setReviewUser(data)
        axios.post('http://localhost:3001/account/reviewItem', data, {
            headers : {
                "Content-Type" : "application/json",
                accessToken : localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            setShowPeerRequests(false)
            setFromReviews(false)
            setToReviews(false)
            setRequestReview(false)
            setShowReviewTo(false)
            setShowReviewFrom(true)
            if(response.data[0].projects.notes) {
                setReviewItem(response.data[0].projects.notes)
            }
            
        })
    }

    const handleSubmitReviewFeedBack = () => {

        axios.post('http://localhost:3001/account/reviewFeedback', 
            {...reviewUser, feedback : reviewFeedBack}, {
            headers : {
                "Content-Type" : "application/json",
                accessToken : localStorage.getItem("accessToken")
            }
        }).then((response) => {
            if(response.data.error) {
                setAuthState(false)
                history('/')
                return
            }
            if(response.data.success) {
                setShowReviewFrom(false)
                setFromReviews(true)
            }
        })
    }

    const handleReviewTo = (data) => {
        let temp = {}
        if(peerData.outgoingReviews) {
            for(let i = 0; i < peerData.outgoingReviews.length; i++) {
                if(peerData.outgoingReviews[i].name === data.name && peerData.outgoingReviews[i].reviewer === data.reviewer) {
                    temp = peerData.outgoingReviews[i]
                }
            }
            setReviewer(temp)
        }

        setShowPeerRequests(false)
        setFromReviews(false)
        setToReviews(false)
        setRequestReview(false)
        setShowReviewFrom(false)
        setShowReviewTo(true)
    }

    const handleRemoveDisabled = (e) => {
        setCurrentNote({...currentNote, note: { ...currentNote.note, notesContent : e.target.value}}); 
        setNotesText(e.target.value);
        // disabledRef.current.disabled = false
        setIsDisabled(false)
    }
    console.log(currentNote)
    return (
        <div className="account" >
            <header className="acc-header">
            <Link to={'/'}><img className='logo' src='./images/redoc1.png'  alt='logo' /></Link>
                <i class="fa-solid fa-bars"></i>
            </header>
            <div className="acc-body">
                <div className="left">
                    <nav id="nav-bar">
                        <h3>{ data.email }</h3>
                        <h4>{ data.username }</h4>
                        <br/>
                        <button className='nav-btn btn-sp'  onClick={()=>setCurrentPage('new-work')}>
                            <p>New</p>
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button className='nav-btn'  onClick={()=>handleCurrentPage('my-works')} ><i class="fa-solid fa-briefcase"></i> <p>My Projects</p> </button>
                        <button className='nav-btn'  onClick={()=>{setCurrentPage('my-works');setRandoms(true); setOpenNote(false); setOpenProject(false ); setIsDisabled(true)}} ><i class="fa-regular fa-file-lines"></i> <p>Notes</p> </button>
                        <button className='nav-btn'  onClick={()=>handleCurrentPage('peer-review')}><i class="fa-solid fa-people-arrows"></i> <p>Peer Review</p> </button>
                        <Link to={'/socials'} className='nav-btn'  onClick={()=>handleCurrentPage('socials')}><i class="fa-solid fa-people-group"></i> <p>Socials</p> </Link>
                        <button className='nav-btn'  onClick={logout}><i class="fa-solid fa-share-from-square"></i> <p>Log out</p> </button>
                    </nav>
                </div>
                <div className="right">
                    {currentPage==='new-work' && (
                        <>
                            {
                                newProject ? 
                                <div className='nav-project'>
                                    <div className='new-project'>
                                        <h1>New Project</h1>
                                        <form className='project-form'>
                                            <label>Project title
                                                <input type='text' name='projectName' className='input' onChange={handleChange} />
                                            </label>
                                            <label >Project Type
                                                <input type='radio' value={'public'} className='input-radio' name='projectType' onChange={handleChange}  /> public
                                                <input type='radio' value={'private'} className='input-radio' name='projectType' onChange={handleChange}  /> private
                                            </label>
                                            <select name='projectField' onChange={handleChange} >
                                                <option value={''} >Field</option>
                                                <option value={'medicine'}>MEDICINE</option>
                                                <option value={'engineering'}>ENGINEERING</option>
                                                <option value={'education'}>EDUCATION</option>
                                            </select>
                                            <div className='form-btns'>
                                                <button onClick={() => setNewProject(false)}>CANCEL</button>
                                                <button onClick={handleSubmitProject}>SAVE</button>
                                            </div>
                                        </form>
                                        {
                                            projectResponse.success ? 
                                            <p style={{color: "green"}}>{ projectResponse.success }</p> : projectResponse.projectError ?
                                            <p style={{color: "red"}}>{ projectResponse.projectError }</p> : ''
                                        }
                                    </div>
                                </div>
                                : newNote ? 
                                <div className='nav-project'>
                                    <div className='new-project'>
                                        <h1>New Note</h1>
                                        <form className='project-form'>
                                            <label>Notes title
                                                <input type='text' name='notesTitle' className='input' onChange={handleChangeNotes} />
                                            </label>
                                            <label >Attach to project
                                                    <input type='radio' onClick={() => {setProjectNote(true); setNotesData({...notesData, notesType: ''})}}  className='input-radio' name='attachToProject' /> Yes
                                                    <input type='radio' onClick={() => {setProjectNote(false); setNotesData({...notesData, attachProject: ''})}}  className='input-radio' name='attachToProject'/> No
                                                </label>
                                            {
                                                projectNote === true ? 
                                                <label>select project
                                                    <select name='attachProject' onChange={handleChangeNotes} >
                                                        <option value={''}></option>
                                                        {
                                                            projects.map((project) => {
                                                                return (
                                                                    <option key={project.projectName} value={project.projectName}>{ project.projectName }</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </label> : projectNote === false ?
                                                <label >Notes Type
                                                    <input type='radio' value={'public'} className='input-radio' name='notesType' onChange={handleChangeNotes}  /> public
                                                    <input type='radio' value={'private'} className='input-radio' name='notesType' onChange={handleChangeNotes}  /> private
                                                </label> : ''
                                            }
                                            <div className='form-btns'>
                                                <button onClick={() => setNewNote(false)}>CANCEL</button>
                                                <button onClick={handleSubmitNote}>SAVE</button>
                                            </div>
                                        </form>
                                        {
                                            noteResponse.success ? 
                                            <p style={{color: "green"}}>{ noteResponse.success }</p> : noteResponse.projectError ?
                                            <p style={{color: "red"}}>{ noteResponse.projectError }</p> : ''                                
                                        }
                                    </div>
                                </div>
                                :
                                <div className='nav-content content1'>
                                    <button className='piece piece1' onClick={() => setNewProject(true)}>
                                        <i class="fa-solid fa-plus"></i>
                                        <p>NEW PROJECT</p>
                                    </button>
                                    <button className='piece' onClick={() => setNewNote(true)}>
                                        <i class="fa-solid fa-file-lines"></i>
                                        <p>NOTES</p>
                                    </button>
                                    <button className='piece'>
                                        <i class="fa-solid fa-paperclip"></i>
                                        <p>UPLOAD FILE</p>
                                    </button>
                                </div>
                            }
                        </>
                    )}
                    {currentPage==='my-works' && (
                        <div className='nav-content'>
                            {
                                openProject ?
                                <div className='project-open'>
                                    <div className='in-project'>
                                        <header className='project-header'>
                                            <h3>Workspace : { currentProject.projectName }</h3>
                                            <h4>{ currentProject.projectType } project</h4>
                                            <h4>Field : {currentProject.projectField} </h4>
                                            <i onClick={() => setOpenProject(false)} ><i class="fa-solid fa-circle-xmark"></i></i>
                                        </header>
                                        <div className='project-add-btn'>
                                            <button onClick={() => {setCurrentPage('new-work');setNewNote(true) }} className='p-btn'>note</button>
                                            <button onClick={() => {setCurrentPage('new-work');setNewFile(true) }} className='p-btn'>file</button>
                                        </div>
                                        <div className='project-workspace'>
                                            <div className='project-notes'>
                                            {
                                                currentProject.notes ? 
                                                currentProject.notes.map((note) => {
                                                   return (
                                                    <button key={note.notesTitle} onClick={() =>handleOpenNote(currentProject, note)} className='small-note'>
                                                        <h4>{ note.notesTitle }</h4>
                                                        <div className='small-note-body'>
                                                            <p>{ note.notesContent }</p>
                                                        </div>
                                                    </button>
                                                   )     
                                                }) : <p>You currently dont have any notes</p>
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : openNote ? 
                                <div className='project-open'>
                                    <div className='in-project'>
                                        
                                    {/* {
                                        currentNote.noteProject ? 
                                        <header className='note-header'>
                                            <h3>Notes: { currentNote.note.notesTitle }</h3>
                                            {
                                            updateNoteResponse.success ? 
                                            <p style={{color: "green"}}>{ updateNoteResponse.success }</p> : updateNoteResponse.projectError ?
                                            <p style={{color: "red"}}>{ updateNoteResponse.projectError }</p> : ''                                
                                            }
                                            <h3>Project: { currentNote.noteProject.projectName }</h3>
                                        </header> : currentNote.note ? 
                                        <header className='note-header'>
                                            <h3>Notes: { currentNote.note.notesTitle }</h3>
                                            {
                                            updateNoteResponse.success ? 
                                            <p style={{color: "green"}}>{ updateNoteResponse.success }</p> : updateNoteResponse.projectError ?
                                            <p style={{color: "red"}}>{ updateNoteResponse.projectError }</p> : ''                                
                                            }
                                            <h3>Type: { currentNote.note.notesType }</h3>
                                        </header> : ''
                                    } */}
                                    <div className='note-workspace'>
                                        <div className='textarea1'> 
                                            <div id='hero'>
                                                {/* <input type='file' ref={imageRef} style={{display: 'none'}} />
                                                {divs}
                                                {
                                                    showTitleInput && 
                                                    <div style={{ display: 'flex', width: 'max-content' }}>
                                                        <input
                                                        style={{ height: '25px', backgroundColor: '#F0F0F0' }}
                                                        type='text'
                                                        value={title}
                                                        onInput={(e) => handleTitleInput(e)} />

                                                        <button
                                                        onClick={handleAddDiv}
                                                        style={{width: '70px'}}>
                                                            ADD
                                                        </button>
                                                    </div>

                                                    
                                                } */}
                                                {/* {
                                                    showTextArea &&
                                                    <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                        <textarea  onChange={(e) => handleAreaInput(e)} style={{ fontSize: '1.1rem', padding: '20px', width: '700px' }} />
                                                        <button onClick={handleAddContent}  style={{ width: '100px', height: '25px', padding: '0 10px' }}>
                                                            ADD TEXT
                                                        </button>
                                                    </div>
                                                } */}
                                                {/* {
                                                    showCode &&
                                                    <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                                        <textarea onChange={(e) => handleCodeInput(e)} style={{ padding: '10px', width: '400px' }} />
                                                        <button onClick={handleCode} style={{ width: '100px', height: '25px' }}>ADD CODE</button>
                                                    </div>
                                                } */}
                                                {
                                                    {/* showImage && */}

                                                }
                                            </div>
                                            {/* <div className='hero-btns'>
                                                <button onClick={() => setShowTitleInput(prev => !prev)} id="title">Title</button>
                                                <button id="image">image</button>
                                                <button onClick={() => setShowTextArea(prev => !prev)} id="normal">normal text</button>
                                                <button onClick={() => setShowCode(prev => !prev)} id="code">code</button>
                                            </div> */}
                                        </div>
                
                                        <div className='note-footer'>
                                            <button className='btn-exit' onClick={() => {setOpenNote(false); setIsDisabled(true)}}>EXIT</button>
                                            <button className='btn-save' disabled={isDisabled} onClick={() => handleUpdateNotes(currentNote)}>SAVE</button>
                                        </div>
                                    </div>
                        
                                    </div>
                                </div>
                                : randoms ? 
                                <div className='project-open randoms'>
                                    <header className='randoms-header'>
                                        <h3>My notes</h3>
                                        <Search {...{randomNotes, setRandomNotes}} unit="randomNotes" />
                                    </header>
                                    <div className='randoms-body'>
                                    {
                                        randomNotes.length === 0 ? 
                                        <h4>No notes available</h4> :
                                        randomNotes.map((note) => {
                                            return (
                                            <button key={note.notesTitle} onClick={() =>handleOpenNote(null, note)} className='small-note r-note'>
                                                <h4>{ note.notesTitle }</h4>
                                                <hr/>
                                                <div className='small-note-body'>
                                                    <p>{ note.notesContent }</p>
                                                </div>
                                            </button>
                                            )
                                        })
                                    }
                                    </div>
                                </div> 
                                :
                                <>
                                    <h2>My Projects</h2>
                                    <div className='content2'>
                                    {
                                        projects.length > 0 ? 
                                        projects.map((project) => {
                                            return (
                                                <div key={project.projectName} className='project'>
                                                    <p className='project-title'>{ project.projectName }</p>
                                                    {
                                                        projectMenu.projectName === project.projectName && toggleProject? 
                                                        <div className='project-body'>
                                                            { project.projectType === 'public' ? <button className='pbtn1' onClick={() => handleProjectType(project.projectName, 'private')} >Make private</button> : <button className='pbtn1'  onClick={() => handleProjectType(project.projectName, 'public')} >Make public</button> }
                                                            <button className='pbtn2' onClick={() => handleRequestReview(project.projectName)}>Request peer review</button>
                                                            <button onClick={() => handleDeleteProject(project.projectName)} className='pbtn3'>Delete project</button>
                                                            
                                                        </div> : ''
                                                    }
                                                    <div className='project-footer'>
                                                        <button onClick={() => toggleProjectMenu(project.projectName)}>menu</button>
                                                        <button onClick={() => handleOpenProject(project)} >open</button>
                                                    </div>
                                                </div>
                                            )
                                        }) : <h3>You currently don't have any projects</h3>
                                    }
                                    </div>
                                </>
                            }

                        </div>
                    )}

                   {currentPage==='peer-review' && (
                        <div className='nav-content peer-reviews'>
                            
                            <div className='peer-left'>
                                <p>PEER REVIEWS : <i>~get confidential reviews from your colleagues</i></p>
                                <button onClick={() => {
                                 setShowPeerRequests(false); 
                                 setFromReviews(false); 
                                 setRequestReview(false);
                                 setShowReviewTo(false);
                                 setShowReviewFrom(false);
                                 setToReviews(false);
                                 setFromReviews(false)}}>
                                 My peers</button>
                                <button onClick={() => {setFromReviews(true);setToReviews(true); setShowPeerRequests(false); setRequestReview(false)}} >Incoming reviews</button>
                                <button onClick={() => {setToReviews(true);setFromReviews(false); setShowPeerRequests(false); setRequestReview(false); setShowReviewFrom(false)}}>Outgoing reviews</button>
                            </div>
                            <div className='peer-right'>
                            {
                                requestReview ? 
                                <div className='peers peers-review'>
                                        <div className='new-project'>
                                            <h3>Request review</h3>
                                            <form className='project-form'>
                                                <label>Project/note name
                                                    <input type='text' className='input' readOnly value={projectReview}  />
                                                </label>
                                                <textarea rows={10} name='reviewDesc' className='textarea' onChange={handleChangeReview} placeholder='provide a brief description of what the review should entail' />
                                                <label>reviewer
                                                    <select name='reviewer' onChange={handleChangeReview} >
                                                        <option value={'none'} >select peer</option>
                                                        {
                                                            peerData.peers ?
                                                            peerData.peers.map(peer => {
                                                                return (
                                                                    <option key={peer} value={peer}>{ peer }</option>
                                                                )
                                                            }) : ''
                                                        }
                                                    </select>
                                                </label>

                                                <button className='r-btn' onClick={handleSubmitReviewRequest} >send</button>
                                            </form>
                                        </div>
                                </div> : 
                                fromReviews ?
                                <div className='peers review-out'>
                                    <h4>Incoming reviews</h4>
                                    {
                                       peerData.incomingReviews ?
                                            peerData.incomingReviews.map(peer => {
                                                return (
                                                    <button onClick={() => handleReviewFrom(peer)} className='review-btn'>
                                                        <p>{ peer.name }</p>
                                                        <p>from</p>
                                                        <p> {peer.from} </p>
                                                    </button>
                                                )
                                            }): <p>No review requests</p>
                                    }
                                </div> :
                                toReviews ?
                                <div className='peers review-out'>
                                    <h4>Outgoing requests</h4>
                                    {
                                       peerData.outgoingReviews ?
                                            peerData.outgoingReviews.map(peer => {
                                                return (
                                                    <button onClick={() => handleReviewTo(peer)} className='review-btn'>
                                                        <p>{ peer.name }</p>
                                                        <p>to</p>
                                                        <p> {peer.reviewer} </p>
                                                    </button>
                                                )
                                            }): <p>No review requests</p>
                                    }
                                </div> :
                                showReviewFrom ?
                                <div className='peers'>
                                    <div className='review-item'>
                                        <div className='review-item-notes'>
                                            <h3>REVIEW REQUEST from { reviewUser.from }</h3>
                                            <div className='review-desc'>
                                                <h5>Description</h5>
                                                <p> { reviewUser.desc } </p>
                                            </div>
        
                                            { reviewItem.length === 0 && <p>No data</p> }

                                            {
                                                reviewItem.map(item => {
                                                    return (
                                                        <div key={item.notesTitle} className='review-item-note'>
                                                            <h3>{ item.notesTitle }</h3>
                                                            <pre>
                                                                { item.notesContent }
                                                            </pre>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        
                                        <textarea placeholder='Leave review here' onChange={(e) => setreviewFeedBack(e.target.value) } className='review-item-review'/>

                                        <div  className='review-item-button'>
                                        <button className='r-btn' onClick={handleSubmitReviewFeedBack}>submit review</button>
                                        </div>
                                    </div>
                                </div> :
                                showReviewTo ?
                                <div className='peers'>
                                    <div className='review-item'>
                                        <h3>REVIEW RESPONSE from { reviewer.reviewer }</h3>
                                        <div className='review-desc'>
                                            <h5>Description</h5>
                                            <p> { reviewer.description } </p>
                                        </div>
            
                                        <div className='review-desc'>
                                            <h5>project</h5>
                                            <p> { reviewer.name } </p>
                                        </div>

                                        <div className='review-desc'>
                                            <h5>Feedback</h5>
                                            <pre>
                                            { reviewer.feedBack.length < 1 ? <p>No feedback yet</p> : reviewer.feedBack }
                                            </pre>
                                        </div>
                                    </div>
                                </div> : 
                                <div className='peers'>
                                    <div className='my-peers'>
                                    <h4>Peer requests</h4>
                                        {
                                            peerData.pendingPeers &&
                                            peerData.pendingPeers.map((peer) => {
                                                 return (
                                                 <div className='peer'>
                                                     <p>{ peer }</p>
                                                     <button onClick={() => handleAcceptPeer(peer)}>ACCEPT</button>
                                                     <button onClick={() => handleRejectPeer(peer)}>REJECT</button>
                                                 </div>
                                                 )
                                             }) 
                                        }
                                        {    
                                            peerData.requestedPeers &&
                                            peerData.requestedPeers.map((peer) => {
                                                return (
                                                <div className='peer'>
                                                    <p>{ peer }</p>
                                                    <button style={{color : "red"}} onClick={() => handleCancelPeer(peer)} >cancel request</button>
                                                </div>
                                                )
                                            })
                                        }
                                        
                                    </div>
                                    <div className='add-peers'>
                                        <h4>Add peer</h4>
                                        <Search />
                                        {
                                            peerUsers.map((peer) => {
                                                return (
                                                    <div style={{display : peer.username === data.username ? 'none' : 'flex'}} key={peer.username} className='peer'>
                                                        <p>{peer.username}</p>
                                                        {
                                                            peerData.pendingPeers && peerData.pendingPeers.includes(peer.username) === true? 
                                                            <button disabled>
                                                                pending...
                                                            </button> :
                                                            
                                                            peerData.requestedPeers && peerData.requestedPeers.includes(peer.username) === true? 
                                                            <button disabled>
                                                                pending...
                                                            </button> :

                                                            peerData.peers && peerData.peers.includes(peer.username) === true? 
                                                            <button disabled>
                                                                peer
                                                            </button> :
                                                            <button style={{color : "green"}} onClick={() => sendPeerRequest(peer.username)} >
                                                                send request <i class="fa-solid fa-plus"></i>
                                                            </button>                                         
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div> 
                            }
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Account;