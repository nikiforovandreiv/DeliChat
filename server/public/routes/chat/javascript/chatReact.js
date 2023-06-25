import React from 'react';

const ChatComponent = () => {
    const sendUserMessage = (userMessage) => {
        // Create the JSX elements
        const containerNewUserMessage = (
            <div className="container_chat_work_dialogue_user_message">
                <div className="chat_work_dialogue_user_message">
                    <p className="chat_work_dialogue_user_message_p" data-value="26">{userMessage}</p>
                </div>
            </div>
        );

        // Render the JSX elements
        return <>{containerNewUserMessage}</>;
    };

    const sendBotMessage = (botMessage) => {
        // Create the JSX elements
        const containerNewBotMessage = (
            <div className="container_chat_work_dialogue_bot_message">
                <div className="chat_work_dialogue_bot_message">
                    <p className="chat_work_dialogue_bot_message_p" data-value="26">{botMessage}</p>
                </div>
                <div className="like-button">
                    <div className="heart-bg">
                        <div className="heart-icon" onClick={handleLikeClick}></div>
                    </div>
                </div>
            </div>
        );

        const handleLikeClick = (event) => {
            const newBotMessageLikeHeartIcon = event.target;
            if (!newBotMessageLikeHeartIcon.classList.contains("liked")) {
                newBotMessageLikeHeartIcon.classList.add("liked");
                const noteContent = newBotMessageLikeHeartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;
                console.log(noteContent);
                sendNoteToServer(email, noteContent);
                addNote(noteContent);
            } else {
                newBotMessageLikeHeartIcon.classList.remove("liked");
                const noteContent = newBotMessageLikeHeartIcon.closest(".like-button").previousElementSibling.querySelector(".chat_work_dialogue_bot_message_p").textContent;
                console.log(noteContent);
                deleteNoteOnTheServer(email, noteContent);
                deleteNote(noteContent);
            }
        };

        // Render the JSX elements
        return <>{containerNewBotMessage}</>;
    };

    return (
        <div>
            {sendUserMessage('Hello, user!')}
            {sendBotMessage('Hello, bot!')}
        </div>
    );
};

export default ChatComponent;
