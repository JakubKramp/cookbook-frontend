import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
    const [isProfileOpen, setIsProfileOpen] = useState(true)
    const [isAuthOpen, setIsAuthOpen] = useState(true)
    const [authMode, setAuthMode] = useState<'register' | 'login'>('register')

    const [profileData, setProfileData] = useState({
        sex: '',
        activity_factor: '',
        age: '',
        height: '',
        weight: '',
        smoking: false,
    })

    const [authData, setAuthData] = useState({
        email: '',
        username: '',
        password: '',
    })



    const handleAuthSubmit = async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        try {
            const response = await fetch(`${API_URL}/user/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authData),
                signal: controller.signal,
            })
            clearTimeout(timeout)
            if (response.ok) {
                toast.success('Account created!')
                setAuthData({ email: '', username: '', password: '' })
            } else {
                const error = await response.json()
                toast.error(error.detail || 'Something went wrong')
            }
        } catch (e) {
            clearTimeout(timeout)
            if (e instanceof DOMException && e.name === 'AbortError') {
                toast.error('Request timed out')
            } else {
                toast.error('Could not connect to server')
            }
        }
    }

    const handleLoginSubmit = async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: authData.username, password: authData.password }),
                signal: controller.signal,
            })
            clearTimeout(timeout)
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                localStorage.setItem('username', authData.username)
                toast.success('Logged in!')
            } else {
                const error = await response.json()
                toast.error(error.detail || 'Invalid credentials')
            }
        } catch (e) {
            clearTimeout(timeout)
            if (e instanceof DOMException && e.name === 'AbortError') {
                toast.error('Request timed out')
            } else {
                toast.error('Could not connect to server')
            }
        }
    }

    const handleProfileSubmit = async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 3000)
        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                method: 'POST',
                headers: {   'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,},
                body: JSON.stringify({
                    sex: profileData.sex || null,
                    activity_factor: profileData.activity_factor || null,
                    age: profileData.age ? parseInt(profileData.age) : null,
                    height: profileData.height ? parseInt(profileData.height) : null,
                    weight: profileData.weight ? parseInt(profileData.weight) : null,
                    smoking: profileData.smoking,
                }),
                signal: controller.signal,
            })
            clearTimeout(timeout)
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                toast.success('Succesfully created profile')
            } else {
                const error = await response.json()
                toast.error(error.detail || `Error ${error.detail}`)
            }
        } catch (e) {
            clearTimeout(timeout)
            if (e instanceof DOMException && e.name === 'AbortError') {
                toast.error('Request timed out')
            } else {
                toast.error('Could not connect to server')
            }
        }
    }

    const inputStyle = {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    }

    const modalStyle = {
        position: 'fixed' as const,
        top: '20px',
        background: 'white',
        color: 'black',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        width: '280px',
        zIndex: 1000,
        overflow: 'hidden',
    }

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        background: '#f5f5f5',
        userSelect: 'none' as const,
    }

    const circleStyle = (isOpen: boolean) => ({
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        border: '2px solid #646cff',
        background: isOpen ? '#ffc664' : 'transparent',
        transition: 'background 0.3s ease',
    })

    return (
        <>
            <Toaster />

            {/* Profile Modal - Right */}
            <div style={{ ...modalStyle, right: '20px' }}>
                <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={headerStyle}>
                    <strong>Profile</strong>
                    <div style={circleStyle(isProfileOpen)} />
                </div>

                {isProfileOpen && (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <select
                            value={profileData.sex}
                            onChange={e => setProfileData({ ...profileData, sex: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Select sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <select
                            value={profileData.activity_factor}
                            onChange={e => setProfileData({ ...profileData, activity_factor: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="Little/no exercise">Little/no exercise</option>
                            <option value="Exercise 1-2 times/week">Exercise 1-2 times/week</option>
                            <option value="Exercise 2-3 times/week">Exercise 2-3 times/week</option>
                            <option value="Exercise 3-5 times/week">Exercise 3-5 times/week</option>
                            <option value="Exercise 6-7 times/week">Exercise 6-7 times/week</option>
                            <option value="Professional athlete">Professional athlete</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Age"
                            value={profileData.age}
                            onChange={e => setProfileData({ ...profileData, age: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Height (cm)"
                            value={profileData.height}
                            onChange={e => setProfileData({ ...profileData, height: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Weight (kg)"
                            value={profileData.weight}
                            onChange={e => setProfileData({ ...profileData, weight: e.target.value })}
                            style={inputStyle}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                checked={profileData.smoking}
                                onChange={e => setProfileData({ ...profileData, smoking: e.target.checked })}
                            />
                            Smoking
                        </label>
                        <button
                            onClick={handleProfileSubmit}
                            style={{ padding: '8px', borderRadius: '4px', background: '#ffc664', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>

            {/* Auth Modal - Left */}
            <div style={{ ...modalStyle, left: '20px' }}>
                <div onClick={() => setIsAuthOpen(!isAuthOpen)} style={headerStyle}>
                    <strong>{authMode === 'register' ? 'Register' : 'Login'}</strong>
                    <div style={circleStyle(isAuthOpen)} />
                </div>

                {isAuthOpen && (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        {/* Toggle Slider */}
                        <div style={{
                            display: 'flex',
                            background: '#f0f0f0',
                            borderRadius: '6px',
                            padding: '3px',
                            gap: '3px',
                        }}>
                            {(['register', 'login'] as const).map(mode => (
                                <button
                                    key={mode}
                                    onClick={(e) => { e.stopPropagation(); setAuthMode(mode) }}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: authMode === mode ? '#ffc664' : 'transparent',
                                        color: authMode === mode ? 'white' : 'black',
                                        transition: 'background 0.2s ease',
                                        fontWeight: authMode === mode ? 'bold' : 'normal',
                                    }}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>

                        {authMode === 'register' && (
                            <input
                                placeholder="Email"
                                type="email"
                                value={authData.email}
                                onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                style={inputStyle}
                            />
                        )}
                        <input
                            placeholder="Username"
                            value={authData.username}
                            onChange={e => setAuthData({ ...authData, username: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={authData.password}
                            onChange={e => setAuthData({ ...authData, password: e.target.value })}
                            style={inputStyle}
                        />
                        <button
                            onClick={authMode === 'register' ? handleAuthSubmit : handleLoginSubmit}
                            style={{ padding: '8px', borderRadius: '4px', background: '#ffc664', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            {authMode === 'register' ? 'Register' : 'Login'}
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <h1>Hello {localStorage.getItem('token') ? authData.username : 'Guest'}</h1>
            </div>
        </>
    )
}

export default App