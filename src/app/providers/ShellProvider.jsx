import { createContext, useContext, useMemo, useState } from 'react'
const ShellContext = createContext(null)
export function ShellProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [issueOnly, setIssueOnly] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const value = useMemo(
        () => ({
            searchQuery,
            setSearchQuery,
            issueOnly,
            setIssueOnly,
            collapsed,
            setCollapsed,
        }),
        [searchQuery, issueOnly, collapsed],
    )
    return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}
export function useShell() {
    const value = useContext(ShellContext)
    if (!value) throw new Error('useShell must be used within ShellProvider')
    return value
}