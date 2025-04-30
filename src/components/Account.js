import Search from './Search'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';
import { useContext } from 'react';
import React from 'react';
import Loading from './Loading';
import Header from './Header1';
import styles from '../css/Account.module.css'

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
        notesDate: new Date().toLocaleDateString(),
        catchPhrase: ''
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
    const disabledRef = useRef(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const [showTitleInput, setShowTitleInput] = useState(false)
    const [title, setTitle] = useState('')
    const [divs, setDivs] = useState([])
    const [contentArea, setContentArea] = useState('')
    const [showTextArea, setShowTextArea] = useState(false)
    const [showCode, setShowCode] = useState(false)
    const [codeArea, setCodeArea] = useState('')
    const imageRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const[inputData, setInputData] = useState([])
    const[inputTrigger, setInputTrigger] = useState(false)

    //title
    const handleAddDiv = () => {
        const tempArray = [title, 'title']
        setInputData(prev => [...prev, tempArray])
        setTitle('')
        setShowTitleInput(false)
    }

    const handleTitleInput = (e) => {
        const input = e.target
        input.style.width = 'auto';
        input.style.width = `${input.scrollWidth}px`;
        setTitle(input.value);
    }

    //area
    const handleAddContent = () => {
        const tempArray = [contentArea, 'content']
        setInputData(prev => [...prev, tempArray])

        setContentArea('')
        setShowTextArea(false)
    }
    const handleAreaInput = (e) => {
        const input = e.target

        input.style.height = 'auto'
        input.style.height = `${input.scrollHeight}px`
        setContentArea(input.value)
    }

    //code
    const handleCode = () => {
        const tempArray = [codeArea, 'code']
        setInputData(prev => [...prev, tempArray])

        setCodeArea('')
        setShowCode(false)
    }

    const handleCodeInput = (e) => {
        const input = e.target

        input.style.height = 'auto'
        input.style.height = `${input.scrollHeight}px`
        setCodeArea(input.value)
    }

    //image
    const handleImage = () => {
        imageRef.current.click()
    }

    const handleChangeImage = (e) => {
        const file = e.target.files[0]
        if(file) {
            const reader = new FileReader()

            reader.onload = async (event) => {
                const newImageDiv = (
                    <div style={{ maxHeight: '500px', maxWidth: '500px' }}>
                        <img src={event.target.result} style={{ maxWidth: '500px', maxHeight: '500px', objectFit: 'contain' }} />
                    </div>
                )
                event.target.value = ''
                const tempArray = [event.target.result, 'image']
                setInputData(prev => [...prev, tempArray])
            }
            reader.readAsDataURL(file)
            
        }
    }

    //new
    const handleChangeNoteItem = (e, index) => {
        const tempArray = inputData
        console.log(e.target.textContent)
        tempArray[index][0] = e.target.innerHTML

        setInputData(tempArray)
    }

    const handleMoveItemUp = (index) => {
        const tempArray = inputData
        const itemClicked = tempArray[index]
        const itemToSwap = index-1 > -1 ? tempArray[index-1] : tempArray[index]

        if(index - 1 > -1){
            tempArray[index -1] = itemClicked
            tempArray[index] = itemToSwap
        }
            setInputData(tempArray) 
            setInputTrigger(!inputTrigger)
    }

    const handleMoveItemDown = (index) => {
        const tempArray = inputData
        const itemClicked = tempArray[index]
        const itemToSwap = index+1 < tempArray.length ? tempArray[index+ 1] : tempArray[index]

        if(index+1 < tempArray.length){
            tempArray[index + 1] = itemClicked
            tempArray[index] = itemToSwap
        }
            setInputData(tempArray) 
            setInputTrigger(!inputTrigger)
    }

    const handleDeleteNoteItem = (index) => {
        const tempArray = inputData
        tempArray.splice(index, 1)
        setInputData(tempArray)
        setInputTrigger(!inputTrigger)
    }
    useEffect(() => {
        setInputData(prev => prev)
    }, [inputTrigger])


    //fetch data from db
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND}/account/myaccount`, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
                "Content-Type" : "application/json"
            }
        }).then(response => {
            setLoading(false)
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


            axios.get(`${process.env.REACT_APP_BACKEND}/account/peers`, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/peerRequest`, {user: user}, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/newproject`, projectData, {
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

        axios.post(`${process.env.REACT_APP_BACKEND}/account/newnote`, notesData, {
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
                setInputData([])
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
                data : inputData
            }
        }
        else if(data.note) {
            notes = {
                project : '',
                notes : data.note.notesTitle,
                data : inputData
            }
        }
        
        axios.post(`${process.env.REACT_APP_BACKEND}/account/updatenotes`, notes, {
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
        setInputData(note.notesContent)
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/projectType`, {type: type, name: name}, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/acceptPeer`, {peer: peer}, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/rejectPeer`, {peer: peer}, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/cancelPeer`, {peer: peer}, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/deleteProject`, {name: name}, {
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
        
        axios.post(`${process.env.REACT_APP_BACKEND}/account/review`, reviewData, {
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
        axios.post(`${process.env.REACT_APP_BACKEND}/account/reviewItem`, data, {
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

        axios.post(`${process.env.REACT_APP_BACKEND}/account/reviewFeedback`, 
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

    function stripHTML(html) {
        return html
            .replace(/<br\s*\/?>/gi, "\n") 
            .replace(/<[^>]*>/g, "");  
    }

    const handleRemoveDisabled = (e) => {
        setCurrentNote({...currentNote, note: { ...currentNote.note, notesContent : e.target.value}}); 
        setNotesText(e.target.value);
        setIsDisabled(false)
    }

    if(loading) {
        return <Loading />
    }

    return (
        <div className={ styles.account } >

            <Header />
            <div className={ styles.accBody }>
                <div className={ styles.left }>
                    <nav id="nav-bar" className={ styles.navBar }>
                        <h3>{ data.email }</h3>
                        <h4>{ data.username }</h4>
                        <br/>
                        <button className={`${styles.navBtn} ${styles.btnSp}`}  onClick={()=>setCurrentPage('new-work')}>
                            <p>New</p>
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button className={styles.navBtn}  onClick={()=>handleCurrentPage('my-works')} ><i className="fa-solid fa-briefcase"></i> <p>My Projects</p> </button>
                        <button className={styles.navBtn}  onClick={()=>{setCurrentPage('my-works');setRandoms(true); setOpenNote(false); setOpenProject(false ); setIsDisabled(true)}} ><i className="fa-regular fa-file-lines"></i> <p>Notes</p> </button>
                        <button className={styles.navBtn}  onClick={()=>handleCurrentPage('peer-review')}><i className="fa-solid fa-people-arrows"></i> <p>Peer Review</p> </button>
                        <Link to={'/socials'} className={styles.navBtn}  onClick={()=>handleCurrentPage('socials')}><i class="fa-solid fa-people-group"></i> <p>Socials</p> </Link>
                        <button className={styles.navBtn}  onClick={logout}><i className="fa-solid fa-share-from-square"></i> <p>Log out</p> </button>
                    </nav>
                </div>
                <div className={ styles.right }>
                    {currentPage==='new-work' && (
                        <>
                            {
                                newProject ? 
                                <div className={styles.navProject}>
                                    <div className={ styles.newProject }>
                                        <h1>New Project</h1>
                                        <form className={ styles.projectForm }>
                                            <label>Project title
                                                <input type='text' name='projectName' className={ styles.input } onChange={handleChange} />
                                            </label>
                                            <label >Project Type
                                                <input type='radio' value={'public'} className={ styles.inputRadio } name='projectType' onChange={handleChange}  /> public
                                                <input type='radio' value={'private'} className={ styles.inputRadio } name='projectType' onChange={handleChange}  /> private
                                            </label>
                                            <select name='projectField' onChange={handleChange} >
                                                <option value={''} >Field</option>
                                                <option value={'Science'}>Science</option>
                                                <option value={'Entertainment'}>Entertainment</option>
                                                <option value={'Medicine'}>Medicine</option>
                                                <option value={'History'}>History</option>
                                                <option value={'engineering'}>Engineering</option>
                                                <option value={'education'}>Education</option>
                                                <option value={'Social Sciences'}>Social Sciences</option>
                                                <option value={'Health'}>Health and Wellness</option>
                                                <option value={'Arts & Humanities'}>Arts & Humanities</option>
                                                <option value={'Business & Finance'}>Business & Finance</option>
                                                <option value={'Information Technology'}>Information Technology</option>
                                                <option value={'Environment'}>Environmental Bio</option>
                                            </select>
                                            <div className={ styles.formBtns }>
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
                                <div className={ styles.navProject }>
                                    <div className={ styles.newProject }>
                                        <h1>New Note</h1>
                                        <form className={ styles.projectForm }>
                                            <label>Notes title
                                                <input type='text' name='notesTitle' className={ styles.input } onChange={handleChangeNotes} />
                                            </label>
                                            <textarea name='catch-phrase' onChange={handleChangeNotes} className={ styles.catchPhrase } placeholder='Enter catch-phrase' />
                                            <label>Attach to project
                                                    <input type='radio' onClick={() => {setProjectNote(true); setNotesData({...notesData, notesType: ''})}}  className={ styles.inputRadio } name='attachToProject' /> Yes
                                                    <input type='radio' onClick={() => {setProjectNote(false); setNotesData({...notesData, attachProject: ''})}}  className={ styles.inputRadio } name='attachToProject'/> No
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
                                                    <input type='radio' value={'public'} className={ styles.inputRadio } name='notesType' onChange={handleChangeNotes}  /> public
                                                    <input type='radio' value={'private'} className={ styles.inputRadio } name='notesType' onChange={handleChangeNotes}  /> private
                                                </label> : ''
                                            }
                                            <div className={ styles.formBtns }>
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
                                <div className={`${styles.navContent} ${styles.content1}`}>
                                    <button className={`${styles.piece}`} onClick={() => setNewProject(true)}>
                                        <i className={`fa-solid fa-plus ${styles.faPlus}`}></i>
                                        <p>NEW PROJECT</p>
                                    </button>
                                    <button className={ styles.piece } onClick={() => {setNewNote(true); setDivs([])}}>
                                        <i className="fa-solid fa-file-lines"></i>
                                        <p>NOTES</p>
                                    </button>
                                </div>
                            }
                        </>
                    )}
                    {currentPage==='my-works' && (
                        <div className={ styles.navContent }>
                            {
                                openProject ?
                                <div className={ styles.projectOpen }>
                                    <div className={ styles.inProject }>
                                        <header className={ styles.projectHeader }>
                                            <h3>Workspace : { currentProject.projectName }</h3>
                                            <h4>{ currentProject.projectType } project</h4>
                                            <h4>Field : {currentProject.projectField} </h4>
                                            <i onClick={() => setOpenProject(false)} ><i class={`fa-solid fa-circle-xmark ${styles.xMark} `}></i></i>
                                        </header>
                                        <div className={ styles.projectAddBtn }>
                                            <button onClick={() => {setCurrentPage('new-work');setNewNote(true) }} className={ styles.pBtn }>note</button>
                                            <button onClick={() => {setCurrentPage('new-work');setNewFile(true) }} className={ styles.pBtn }>file</button>
                                        </div>
                                        <div className={ styles.projectWorkspace }>
                                            <div className={ styles.projectNotes }>
                                            {
                                                currentProject.notes ? 
                                                currentProject.notes.map((note) => {
                                                   return (
                                                    <button key={note.notesTitle} onClick={() =>handleOpenNote(currentProject, note)} className={ styles.smallNote }>
                                                        <h4>{ note.notesTitle }</h4>
                                                        <div className={ styles.smallNoteBody }>
                                                            {note.catchPhrase}
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
                                <div className={ styles.projectOpen }>
                                    <div className={ styles.inProject }>
                                        
                                    {
                                        currentNote.noteProject ? 
                                        <header className={ styles.noteHeader }>
                                            <h3>Notes: { currentNote.note.notesTitle }</h3>
                                            {
                                            updateNoteResponse.success ? 
                                            <p style={{color: "green"}}>{ updateNoteResponse.success }</p> : updateNoteResponse.projectError ?
                                            <p style={{color: "red"}}>{ updateNoteResponse.projectError }</p> : ''                                
                                            }
                                            <h3>Project: { currentNote.noteProject.projectName }</h3>
                                        </header> : currentNote.note ? 
                                        <header className={ styles.noteHeader }>
                                            <h3>Notes: { currentNote.note.notesTitle }</h3>
                                            {
                                            updateNoteResponse.success ? 
                                            <p style={{color: "green"}}>{ updateNoteResponse.success }</p> : updateNoteResponse.projectError ?
                                            <p style={{color: "red"}}>{ updateNoteResponse.projectError }</p> : ''                                
                                            }
                                            <h3>Type: { currentNote.note.notesType }</h3>
                                        </header> : ''
                                    }
                                    <div className={ styles.noteWorkspace }>
                                        <div className={ styles.textarea1 }>
                                            <div id='hero' className={ styles.hero }>
                                                <input type='file' onChange={handleChangeImage} ref={imageRef} style={{display: 'none'}} />
                                                {
                                                    inputData.map((item, index) => {
                                                        return (
                                                            <div className={ styles.edDiv } key={index}>
                                                            {
                                                                item[1] === 'title' ? 
                                                                <h2 className={ styles.edItem } contentEditable 
                                                                
                                                                suppressContentEditableWarning onInput={(e) => handleChangeNoteItem(e, index)} >{ stripHTML(item[0]) }</h2> : 

                                                                item[1] === 'content' ? 
                                                                <p className={ styles.edItem } contentEditable 
                                                                
                                                                suppressContentEditableWarning onInput={(e) => handleChangeNoteItem(e, index)} >{ stripHTML(item[0]) }</p> :

                                                                item[1] === 'code' ?
                                                                <code className={ styles.edItem } contentEditable 
                                                                suppressContentEditableWarning onInput={(e) => handleChangeNoteItem(e, index)}>{ stripHTML(item[0]) }</code> :

                                                                item[1] === 'image' && 
                                                                <img className='ed-image' src={item[0]} />
                                                            }
                                                            <div className={ styles.edBtns }>
                                                                <i className={`fa-solid fa-arrow-up ${styles.faSolid}  ${styles.faArrow}`} onClick={() => handleMoveItemUp(index)}></i>
                                                                <i className={`fa-solid fa-arrow-down ${styles.faSolid}  ${styles.faArrow}`} onClick={() => handleMoveItemDown(index)}></i>
                                                                <i class={`fa-solid fa-trash ${styles.faSolid}  ${styles.faTrash}`} onClick={() => handleDeleteNoteItem(index)} ></i>
                                                            </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                 
                                                {
                                                    showTitleInput && 
                                                    <div style={{ display: 'flex', width: 'max-content', gap: '5px' }}>
                                                        <input
                                                        style={{ height: '5vh', backgroundColor: '#F0F8FF', border: 'none', borderBottom: '1px solid #C0C0C0', paddingLeft: '5px' }}
                                                        placeholder='Enter title here'
                                                        type='text'
                                                        value={title}
                                                        onInput={(e) => handleTitleInput(e)} />

                                                        <button
                                                        className={ styles.rBtn }
                                                        onClick={handleAddDiv}
                                                        style={{width: '70px', height: '5vh'}}>
                                                            ADD
                                                        </button>
                                                    </div>

                                                    
                                                }
                                                {
                                                    showTextArea &&
                                                    <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column' }}>

                                                        <textarea  onChange={(e) => handleAreaInput(e)} placeholder='Enter text here...' style={{ fontSize: '1.1rem', padding: '8px', width: '650px', backgroundColor: '#F0F8FF', border: 'none', borderBottom: '1px solid #C0C0C0' }} />

                                                        <button onClick={handleAddContent} className={ styles.rBtn }  style={{ width: '120px', height: '5vh', padding: '0 10px' }}>
                                                            ADD TEXT
                                                        </button>
                                                    </div>
                                                }
                                                {
                                                    showCode &&
                                                    <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column'  }}>

                                                        <textarea placeholder='Type code here...' onChange={(e) => handleCodeInput(e)} style={{ padding: '10px', width: '400px', backgroundColor: '#F0F8FF', border: 'none', borderBottom: '1px solid #C0C0C0' }} />

                                                        <button className={ styles.rBtn } onClick={handleCode} style={{ width: '100px', height: '5vh' }}>ADD CODE</button>
                                                    </div>
                                                }
                                            </div>
                                            <div className={ styles.heroBtns }>
                                                <button onClick={() => setShowTextArea(prev => !prev)} id="normal">normal text</button>
                                                <button onClick={() => setShowTitleInput(prev => !prev)} id="title">Title</button>
                                                <button onClick={handleImage} id="image">image</button>
                                                <button onClick={() => setShowCode(prev => !prev)} id="code">code</button>
                                            </div>
                                        </div>
                
                                        <div className={ styles.noteFooter }>
                                            <button className={ styles.btnExit } onClick={() => {setOpenNote(false); setIsDisabled(true)}}>EXIT</button>
                                            <button className={ styles.btnSave } onClick={() => handleUpdateNotes(currentNote)}>SAVE</button>
                                        </div>
                                    </div>
                        
                                    </div>
                                </div>
                                : randoms ? 
                                <div className={`${styles.projectOpen}`}>
                                    <header className={ styles.randomsHeader }>
                                        <h3>My notes</h3>
                                        <Search {...{randomNotes, setRandomNotes}} unit="randomNotes" />
                                    </header>
                                    <div className={ styles.randomsBody }>
                                    {
                                        randomNotes.length === 0 ? 
                                        <h4>No notes available</h4> :
                                        randomNotes.map((note) => {
                                            return (
                                            <button key={note.notesTitle} onClick={() =>handleOpenNote(null, note)} className={`${styles.smallNote} r-note`}>
                                                <h4>{ note.notesTitle }</h4>
                                                <hr/>
                                                <div className={ styles.smallNoteBody }>
                                                {note.catchPhrase}
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
                                    <div className={ styles.content2 }>
                                    {
                                        projects.length > 0 ? 
                                        projects.map((project) => {
                                            return (
                                                <div key={project.projectName} className={ styles.project }>
                                                    <p className={ styles.projectTitle }>{ project.projectName }</p>
                                                    {
                                                        projectMenu.projectName === project.projectName && toggleProject? 
                                                        <div className={ styles.projectBody }>
                                                            { project.projectType === 'public' ? <button  onClick={() => handleProjectType(project.projectName, 'private')} >Make private</button> : <button  onClick={() => handleProjectType(project.projectName, 'public')} >Make public</button> }
                                                            <button onClick={() => handleRequestReview(project.projectName)}>Request peer review</button>
                                                            <button onClick={() => handleDeleteProject(project.projectName)} >Delete project</button>
                                                            
                                                        </div> : ''
                                                    }
                                                    <div className={ styles.projectFooter }>
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
                        <div className={`${styles.navContent} ${styles.peerReviews}`}>
                            
                            <div className={ styles.peerLeft }>
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
                            <div className={ styles.peerRight }>
                            {
                                requestReview ? 
                                <div className={`${styles.peers} ${styles.peersReview}`}>
                                        <div className={ styles.newProject }>
                                            <h3>Request review</h3>
                                            <form className={ styles.projectForm }>
                                                <label>Project/note name
                                                    <input type='text' className={ styles.input } readOnly value={projectReview}  />
                                                </label>
                                                <textarea rows={10} name='reviewDesc' className={ styles.textarea } onChange={handleChangeReview} placeholder='provide a brief description of what the review should entail' />
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

                                                <button className={ styles.rBtn } onClick={handleSubmitReviewRequest} >send</button>
                                            </form>
                                        </div>
                                </div> : 
                                fromReviews ?
                                <div className={`${styles.peers} ${styles.reviewOut}`}>
                                    <h4>Incoming reviews</h4>
                                    {
                                       peerData.incomingReviews ?
                                            peerData.incomingReviews.map(peer => {
                                                return (
                                                    <button onClick={() => handleReviewFrom(peer)} className={ styles.reviewBtn }>
                                                        <p>{ peer.name }</p>
                                                        <p>from</p>
                                                        <p> {peer.from} </p>
                                                    </button>
                                                )
                                            }): <p>No review requests</p>
                                    }
                                </div> :
                                toReviews ?
                                <div className={`${styles.peers} ${styles.reviewOut}`}>
                                    <h4>Outgoing requests</h4>
                                    {
                                       peerData.outgoingReviews ?
                                            peerData.outgoingReviews.map(peer => {
                                                return (
                                                    <button onClick={() => handleReviewTo(peer)} className={ styles.reviewBtn }>
                                                        <p>{ peer.name }</p>
                                                        <p>to</p>
                                                        <p> {peer.reviewer} </p>
                                                    </button>
                                                )
                                            }): <p>No review requests</p>
                                    }
                                </div> :
                                showReviewFrom ?
                                <div className={ styles.peers }>
                                    <div className={ styles.reviewItem }>
                                        <div className={ styles.reviewItemNotes }>
                                            <h3>REVIEW REQUEST from { reviewUser.from }</h3>
                                            <div className={ styles.reviewDesc }>
                                                <h5>Description</h5>
                                                <p> { reviewUser.desc } </p>
                                            </div>
        
                                            { reviewItem.length === 0 && <p>No data</p> }

                                            {
                                                reviewItem.map(item => {
                                                    return (
                                                        <div key={item.notesTitle} className={ styles.reviewItemNote }>
                                                            <h3>{ item.notesTitle }</h3>
                                                            <div>
                                                            {
                                                                item.notesContent.map((note, index) => {
                                                                if (note && note.type) {
                                                                        return <>
                                                                            {
                                                                                note[1] === 'title' ? 
                                                                                <p className={ styles.textTitle }>{ note[0] }</p> : 
                                                                                note[1] === 'content' ? 
                                                                                <p className={ styles.textParagraph }>{ note[0] }</p> : 
                                                                                note[1] === 'code' ?
                                                                                <p className={ styles.textCode }>{ note[0] }</p> : 
                                                                                note[1] === 'image' && 
                                                                                <img src={note[0]} className={ styles.edImage } alt='image-item' />
                                                                            }
                                                                        </> 
                                                                }
                                                                
                                                            })}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        
                                        <textarea placeholder='Leave review here' onChange={(e) => setreviewFeedBack(e.target.value) } className={ styles.reviewItemReview }/>

                                        <div  className={ styles.reviewItemButton }>
                                        <button className={ styles.rBtn } onClick={handleSubmitReviewFeedBack}>submit review</button>
                                        </div>
                                    </div>
                                </div> :
                                showReviewTo ?
                                <div className={ styles.peers }>
                                    <div className={ styles.reviewItem }>
                                        <h3>REVIEW RESPONSE from { reviewer.reviewer }</h3>
                                        <div className={ styles.reviewDesc }>
                                            <h5>Description</h5>
                                            <p> { reviewer.description } </p>
                                        </div>
            
                                        <div className={ styles.reviewDesc }>
                                            <h5>project</h5>
                                            <p> { reviewer.name } </p>
                                        </div>

                                        <div className={ styles.reviewDesc }>
                                            <h5>Feedback</h5>
                                            <pre>
                                            { reviewer.feedBack.length < 1 ? <p>No feedback yet</p> : reviewer.feedBack }
                                            </pre>
                                        </div>
                                    </div>
                                </div> : 
                                <div className={ styles.peers }>
                                    <div className={ styles.myPeers }>
                                    <h4>Peer requests</h4>
                                        {
                                            peerData.pendingPeers &&
                                            peerData.pendingPeers.map((peer) => {
                                                 return (
                                                 <div className={ styles.peer }>
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
                                                <div className={ styles.peer }>
                                                    <p>{ peer }</p>
                                                    <button style={{color : "red"}} onClick={() => handleCancelPeer(peer)} >cancel request</button>
                                                </div>
                                                )
                                            })
                                        }
                                        
                                    </div>
                                    <div className={ styles.addPeers }>
                                        <h4>Add peer</h4>
                                        <Search {...{peerUsers, setPeerUsers}} unit="peerUsers" />
                                        {
                                            peerUsers.map((peer) => {
                                                return (
                                                    <div style={{display : peer.username === data.username ? 'none' : 'flex'}} key={peer.username} className={ styles.peer }>
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