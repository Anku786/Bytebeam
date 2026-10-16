import { BrowserRouter } from 'react-router-dom'
import { FleetDataProvider } from './FleetDataProvider.jsx'
import { ShellProvider } from './ShellProvider.jsx'
import { SimulatorProvider } from './SimulatorProvider.jsx'
export function AppProviders({ children }) {
    return (
        <BrowserRouter>
            <ShellProvider>
                <FleetDataProvider>
                    <SimulatorProvider>{children}</SimulatorProvider>
                </FleetDataProvider>
            </ShellProvider>
        </BrowserRouter>
    )
}