import { useEffect, useState } from "react"

export default function Search({ notes1, notes2, setNotes2, setNotes1, unit, randomNotes, setRandomNotes }) {
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
    }, [notes1])

    const handleChange = (e) => {
        const search = e.target.value.toLowerCase()
        if(unit === "projectNotes") {
            if(search === "") {
                setNotes1(originalNotes)
            } else {
                const notes = originalNotes.filter((note) => {
                    return note.notesContent.toLowerCase().includes(search)
                    || note.notesTitle.toLowerCase().includes(search)
                    || note.username.toLowerCase().includes(search)
                })

                const notes2 = originalNotes2.filter((note) => {
                    return note.randomNotes.notesContent.toLowerCase().includes(search)
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
                    return note.notesContent.toLowerCase().includes(search)
                    || note.notesTitle.toLowerCase().includes(search)
                })
                setRandomNotes(notes)
            }
        }
        
    }
    return (
        <div className="search">
            <input type="text" placeholder="Search articles" onChange={(e) => handleChange(e)} />
        </div>
    )
}