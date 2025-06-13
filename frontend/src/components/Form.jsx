import { useState } from "react"
import styles from './form.module.css'

export default function Form({ onAddStory }) {
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (!story.trim()) {
            setError("Please enter a story before submitting.")
            return
        }
        
        // Send story to pending queue instead of directly to stories
        onAddStory(story.trim())
        setStory("")
        setError("")
        setSuccessMessage("Your story has been submitted and is pending approval!")
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage("")
        }, 3000)
    }

    return (
        <>
            <form className={styles.storyForm} onSubmit={handleSubmit}>
                <input
                    className={styles.modernInput}
                    onChange={(e) => {
                        setStory(e.target.value)
                        setError("")
                        setSuccessMessage("")
                    }}
                    type='text'
                    value={story}
                    placeholder="Enter your story"
                />
                <button className={styles.modernButton} type='submit'>Submit</button>
            </form>
            
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className={styles.successMessage}>
                    {successMessage}
                </div>
            )}
        </>
    )
}
