import { useState } from 'react'
import MillLogin from './MillLogin'
import MillSignUp from './MillSignUp'

const AuthPage = ({ onAuthSuccess, onExit }) => {
  const [currentView, setCurrentView] = useState('login') // 'login' or 'signup'

  const handleLoginSuccess = (userData) => {
    onAuthSuccess(userData)
  }

  const handleSignUpSuccess = (userData) => {
    onAuthSuccess(userData)
  }

  const goToSignUp = () => {
    setCurrentView('signup')
  }

  const goToLogin = () => {
    setCurrentView('login')
  }

  if (currentView === 'signup') {
    return (
      <MillSignUp 
        onSignUpSuccess={handleSignUpSuccess}
        onBackToLogin={goToLogin}
        onExit={onExit}
      />
    )
  }

  return (
    <MillLogin 
      onLoginSuccess={handleLoginSuccess}
      onGoToSignUp={goToSignUp}
      onExit={onExit}
    />
  )
}

export default AuthPage
