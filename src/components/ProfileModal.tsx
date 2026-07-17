import { useState } from 'react'
import toast from 'react-hot-toast'
import { API_URL } from '../config'
import {
    inputStyle,
    modalStyle,
    headerStyle,
    circleStyle,
    modalBodyStyle,
    primaryButtonStyle,
    checkboxLabelStyle,
} from './modalStyles'

export function ProfileModal() {
    const [isProfileOpen, setIsProfileOpen] = useState(true)

    const [profileData, setProfileData] = useState({
        sex: '',
        activity_factor: '',
        age: '',
        height: '',
        weight: '',
        smoking: false,
    })

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

    return (
        <div style={{ ...modalStyle, right: '20px' }}>
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={headerStyle}>
                <strong>Profile</strong>
                <div style={circleStyle(isProfileOpen)} />
            </div>

            {isProfileOpen && (
                <div style={modalBodyStyle}>
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
                    <label style={checkboxLabelStyle}>
                        <input
                            type="checkbox"
                            checked={profileData.smoking}
                            onChange={e => setProfileData({ ...profileData, smoking: e.target.checked })}
                        />
                        Smoking
                    </label>
                    <button
                        onClick={handleProfileSubmit}
                        style={primaryButtonStyle}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    )
}
