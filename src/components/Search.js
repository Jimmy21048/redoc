import { useEffect, useState } from "react"

export default function Search({ notes1, notes2, setNotes2, setNotes1, unit, randomNotes, setRandomNotes, peerUsers, setPeerUsers }) {
    const [originalNotes, setOriginalNotes] = useState([]);
    const [originalNotes2, setOriginalNotes2] = useState([]);

    useEffect(() => {
        if(unit === "projectNotes") {
            if(notes1.length !== 0 && notes1.length > originalNotes.length) {
                setOriginalNotes(notes1)
            }
            if(notes2.length !==0 && notes2.length > originalNotes2.length) {
                setOriginalNotes2(notes2)
            }
        } 
        if(unit === "randomNotes") {
            if(randomNotes.length !== 0 && randomNotes.length > originalNotes.length) {
                setOriginalNotes(randomNotes)
            }
        }
        if(unit === "peer-users") {
            if(peerUsers.length !== 0 && peerUsers.length > originalNotes.length) {
                setOriginalNotes(peerUsers)
            }
        }
    }, [notes1])

    const handleChange = (e) => {
        const search = e.target.value.toLowerCase()
        if(unit === "projectNotes") {
            if(search === "") {
                setNotes1(originalNotes)
            } else {
                const notes = originalNotes.filter((note) => {
                    return note.catchPhrase.toLowerCase().includes(search)
                    || note.notesTitle.toLowerCase().includes(search)
                    || note.username.toLowerCase().includes(search)
                })

                const notes2 = originalNotes2.filter((note) => {
                    return note.randomNotes.catchPhrase.toLowerCase().includes(search)
                    || note.randomNotes.notesTitle.toLowerCase().includes(search)
                    || note.username.toLowerCase().includes(search)
                })
                setNotes1(notes)
                setNotes2(notes2)
            }
        }

        if(unit === "randomNotes") {
            if(search === "") {
                setRandomNotes(originalNotes)
            } else {
                const notes = originalNotes.filter((note) => {
                    return note.notesTitle.toLowerCase().includes(search) 
                    || note.catchPhrase.toLowerCase().includes(search)
                })
                setRandomNotes(notes)
            }
        }

        if(unit === "peer-users") {
            if(search === "") {
                setPeerUsers(originalNotes)
            } else {
                const users = originalNotes.filter(note => {
                    return note.username.toLowerCase().includes(search)
                })
                setPeerUsers(users)
            }
        }
        
    }
    return (
        <div className="search">
            <input type="text" placeholder="Search title here..." onChange={(e) => handleChange(e)} />
        </div>
    )
}