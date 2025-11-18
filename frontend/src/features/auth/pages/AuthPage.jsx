import { useState } from 'react'
import MillLogin from './MillLogin';
import MillSignUp from './MillSignUp';
import ForgotPassword from './ForgotPassword';

const AuthPage = ({ onAuthSuccess, onExit }) => {
  const [currentView, setCurrentView] = useState('login') // 'login', 'signup', or 'forgot-password'

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

  const goToForgotPassword = () => {
    setCurrentView('forgot-password')
  }

  if (currentView === 'forgot-password') {
    return (
      <ForgotPassword
        onBackToLogin={goToLogin}
        onExit={onExit}
      />
    )
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
      onGoToForgotPassword={goToForgotPassword}
      onExit={onExit}
    />
  )
}

export default AuthPage
