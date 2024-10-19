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
    const [showPeers, setShowPeers] = useState(false);
    const [showPeerRequests, setShowPeerRequests] = useState(false);
    const [peerData, setPeerData] = useState([]);


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
                history('/login');
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
                history('/login');
            }
            setUpdateNoteResponse(response.data);
            setTimeout(() => {
                setUpdateNoteResponse('')
            }, 5000)
        })    
    }

    const handleOpenNote = (project, note)  => {
        // console.log(currentNote);
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
                        <button className='nav-btn'  onClick={()=>{setCurrentPage('my-works');setRandoms(true); setOpenNote(false); setOpenProject(false )}} ><i class="fa-regular fa-file-lines"></i> <p>Notes</p> </button>
                        <button className='nav-btn'  onClick={()=>handleCurrentPage('peer-review')}><i class="fa-solid fa-people-arrows"></i> <p>Peer Review</p> </button>
                        <Link to={'/socials'} className='nav-btn'  onClick={()=>handleCurrentPage('socials')}><i class="fa-solid fa-people-group"></i> <p>Socials</p> </Link>
                        <button className='nav-btn'  onClick={()=>handleCurrentPage('chats')}><i class="fa-solid fa-comment-dots"></i> <p>Chats</p> </button>
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
                                        
                                    {
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
                                    }
                                    <div className='note-workspace'>
                                        <textarea placeholder='Type here...' value={currentNote.note.notesContent} rows={70}  onChange={(e) =>{ setCurrentNote({...currentNote, note: { ...currentNote.note, notesContent : e.target.value}}); setNotesText(e.target.value) }} />
                                        <div className='note-footer'>
                                            <button className='btn-exit' onClick={() => setOpenNote(false)}>EXIT</button>
                                            <button className='btn-save' onClick={() => handleUpdateNotes(currentNote)}>SAVE</button>
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
                                                            <button className='pbtn2'>Request peer review</button>
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
                                <button onClick={() => {setShowPeers(prev => !prev); setShowPeerRequests(false)}}>My peers</button>
                                <button onClick={() => {setShowPeerRequests(prev => !prev); setShowPeers(false)}}>Peer requests</button>
                                <button>Incoming reviews</button>
                                <button>Outgoing reviews</button>
                            </div>
                            <div className='peer-right'>
                            {
                                showPeers ? 
                                <div className='peers'>
                                    <div className='my-peers'>
                                        <h4>My peers</h4>
                                        {
                                            peerData.peers ?
                                            peerData.peers.map((peer) => {
                                                return (
                                                    <div  key={peer} className='peer'>
                                                        <p>{ peer }</p>
                                                    </div>
                                                )
                                            }) : <p>No peers found</p>
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
                                                                send request <i class="fa-solid fa-plus"></i>
                                                            </button> :
                                                            
                                                            peerData.requestedPeers && peerData.requestedPeers.includes(peer.username) === true? 
                                                            <button disabled>
                                                            send request <i class="fa-solid fa-plus"></i>
                                                            </button> :

                                                            peerData.peers && peerData.peers.includes(peer.username) === true? 
                                                            <button disabled>
                                                            send request <i class="fa-solid fa-plus"></i>
                                                            </button> :
                                                            <button onClick={() => sendPeerRequest(peer.username)} >
                                                                send request <i class="fa-solid fa-plus"></i>
                                                            </button>                                         
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                : showPeerRequests ?
                                <div className='peers'>
                                    <div className='my-peers'>
                                        <h4>Peer requests</h4>
                                        {
                                            peerData.pendingPeers ?
                                            peerData.pendingPeers.map((peer) => {
                                                 return (
                                                 <div className='peer'>
                                                     <p>{ peer }</p>
                                                     <button onClick={() => handleAcceptPeer(peer)}>ACCEPT</button>
                                                     <button onClick={() => handleRejectPeer(peer)}>REJECT</button>
                                                 </div>
                                                 )
                                             }) : ''
                                        }
                                    </div>
                                    <div className='add-peers'>
                                        <h4>Pending requests</h4>
                                        {
                                            peerData.requestedPeers ? 
                                            peerData.requestedPeers.map((peer) => {
                                                return (
                                                <div className='peer'>
                                                    <p>{ peer }</p>
                                                    <button onClick={() => handleCancelPeer(peer)} >CANCEL REQUEST</button>
                                                </div>
                                                )
                                            }) : ''
                                        }
                                    </div>
                                </div> : ''
                            }
                            </div>
                        </div>
                    )}

                    {currentPage==='chats' && (
                        <div className='nav-content'>
                            This is the chats page
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Account;