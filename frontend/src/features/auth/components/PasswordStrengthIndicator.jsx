import { useEffect, useState } from 'react';
import { validatePassword } from '../../../utils/validation';

const PasswordStrengthIndicator = ({ password }) => {
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    if (password) {
      const result = validatePassword(password);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [password]);

  if (!validation || !password) return null;

  const { strength, validations } = validation;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Password Strength</span>
          <span className={`font-bold capitalize ${
            strength.color === 'red' ? 'text-red-600' :
            strength.color === 'yellow' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {strength.level}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength.color === 'red' ? 'bg-red-500' :
              strength.color === 'yellow' ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
        <p className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</p>
        
        <div className="space-y-1">
          <ValidationItem 
            isValid={validations.length} 
            text="At least 8 characters"
          />
          <ValidationItem 
            isValid={validations.uppercase} 
            text="One uppercase letter (A-Z)"
          />
          <ValidationItem 
            isValid={validations.lowercase} 
            text="One lowercase letter (a-z)"
          />
          <ValidationItem 
            isValid={validations.number} 
            text="One number (0-9)"
          />
          <ValidationItem 
            isValid={validations.special} 
            text="One special character (!@#$%^&*)"
          />
        </div>
      </div>
    </div>
  );
};

const ValidationItem = ({ isValid, text }) => (
  <div className="flex items-center gap-2">
    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
      isValid ? 'bg-green-500' : 'bg-gray-300'
    }`}>
      {isValid && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className={`text-xs ${isValid ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
      {text}
    </span>
  </div>
);

export default PasswordStrengthIndicator;
