import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import './styles/App.css'
import { AuthModal } from './components/AuthModal'
import { ProfileModal } from './components/ProfileModal'

function App() {
    const [loggedInUsername, setLoggedInUsername] = useState(() => localStorage.getItem('username'))

    return (
        <>
            <Toaster />

            <ProfileModal />

            <AuthModal onLogin={setLoggedInUsername} />

            {/* Main Content */}
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <h1>Hello {localStorage.getItem('token') ? loggedInUsername : 'Guest'}</h1>
            </div>
        </>
    )
}

export default App
