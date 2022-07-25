import { useState } from 'react';
import { useNavigate } from "react-router-dom";


export const AuthPage = () => {
	const navigate = useNavigate();
    const [name, setName] = useState('');
    
    const navigateToChatPage = () => {
        if (name) navigate(`/chat/${name}`);
    }

	return (
		<main className='simple-wrapper'>
            <div className='simple-heading'>Hey there</div>

            <div id='name-label' className='simple-subhead'>
                What should your peers call you?
            </div>

            <div className='simple-section'>
				<input
					aria-labelledby='name-label'
					type='text'
					autoComplete='name'
					placeholder='Your name or nickname'
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') navigateToChatPage();
                    }}
				/>
			</div>

            <div className='simple-section'>
				<button onClick={navigateToChatPage}>Start chatting</button>
			</div>
		</main>
	);
};