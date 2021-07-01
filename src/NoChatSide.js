import React, { useEffect } from 'react'

function NoChatSide() {

    useEffect(() => {
        document.title = "Instagram ⚪ Inbox "
    }, [])

    return (
        <div className="messages_subcontainer_right" >
            <div className="messages_subcontainer_nochat" >
                <div className="start_chat_page" />
                <h2>Your Messages</h2>
                <strong>Send private photos and messages to a friend or group.</strong>
                <button> Send Message </button>
            </div>
        </div>
    )
}

export default NoChatSide
