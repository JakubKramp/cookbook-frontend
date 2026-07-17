export const authColors = {
    bg: "#100d0a",
    cardBg: "#171310",
    border: "rgba(255,255,255,.1)",
    text: "#f5ede2",
    textMuted: "rgba(245,237,226,.6)",
    textFaint: "#a8998a",
    amber: "#f2b53c",
    ember: "#e8722a",
} as const;


export const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
}

export const modalStyle = {
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

export const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    background: '#f5f5f5',
    userSelect: 'none' as const,
}

export const circleStyle = (isOpen: boolean) => ({
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid #646cff',
    background: isOpen ? '#ffc664' : 'transparent',
    transition: 'background 0.3s ease',
})

export const modalBodyStyle = {
    padding: '16px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '10px',
}

export const primaryButtonStyle = {
    padding: '8px',
    borderRadius: '4px',
    background: '#ffc664',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
}

export const checkboxLabelStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
}

/* Auth-specific styling now lives in ./AuthModal.css (needs :focus/::placeholder/@import,
   which plain inline style objects cannot express). */
