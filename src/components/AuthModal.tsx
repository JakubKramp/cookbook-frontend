import { useState } from 'react'
import toast from 'react-hot-toast'
import { API_URL } from '../config'
import './AuthModal.css'

interface AuthModalProps {
    onLogin: (username: string) => void
}

export function AuthModal({ onLogin }: AuthModalProps) {
    const [isAuthOpen, setIsAuthOpen] = useState(true)
    const [authMode, setAuthMode] = useState<'register' | 'login'>('login')

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
                onLogin(authData.username)
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

    return (
        <div className="auth-card">
            <div className={`auth-widget-header${isAuthOpen ? ' open' : ''}`} onClick={() => setIsAuthOpen(!isAuthOpen)}>
                <strong>{authMode === 'register' ? 'Sign up' : 'Log in'}</strong>
            </div>

            {isAuthOpen && (
                <div className="auth-card-body">
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`auth-tab${authMode === 'login' ? ' active' : ''}`}
                            onClick={() => setAuthMode('login')}
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            className={`auth-tab${authMode === 'register' ? ' active' : ''}`}
                            onClick={() => setAuthMode('register')}
                        >
                            Sign up
                        </button>
                        <span className={`auth-tab-indicator${authMode === 'register' ? ' signup' : ''}`} />
                    </div>

                    {authMode === 'login' ? (
                        <form className="auth-form" onSubmit={e => { e.preventDefault(); handleLoginSubmit() }}>
                            <div className="auth-field">
                                <label htmlFor="auth-login-username">Username</label>
                                <input
                                    id="auth-login-username"
                                    placeholder="Username"
                                    value={authData.username}
                                    onChange={e => setAuthData({ ...authData, username: e.target.value })}
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="auth-login-password">Password</label>
                                <input
                                    id="auth-login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={authData.password}
                                    onChange={e => setAuthData({ ...authData, password: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="auth-submit login">Sign in</button>
                            <div className="auth-switch login-link">
                                New here? <button type="button" onClick={() => setAuthMode('register')}>Create an account</button>
                            </div>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={e => { e.preventDefault(); handleAuthSubmit() }}>
                            <div className="auth-field">
                                <label htmlFor="auth-signup-email">Email</label>
                                <input
                                    id="auth-signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={authData.email}
                                    onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="auth-signup-username">Username</label>
                                <input
                                    id="auth-signup-username"
                                    placeholder="Username"
                                    value={authData.username}
                                    onChange={e => setAuthData({ ...authData, username: e.target.value })}
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="auth-signup-password">Password</label>
                                <input
                                    id="auth-signup-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={authData.password}
                                    onChange={e => setAuthData({ ...authData, password: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="auth-submit signup">Create account</button>
                            <div className="auth-switch signup-link">
                                Already have one? <button type="button" onClick={() => setAuthMode('login')}>Log in</button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    )
}
