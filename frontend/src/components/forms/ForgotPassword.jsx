import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, verifyResetCode, resetPassword } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setStep(2);
      toast.success('Reset code sent to your email!', {
        duration: 4000,
        icon: '📧',
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to send reset code', {
        duration: 4000,
      });
    }
  });

  const verifyMutation = useMutation({
    mutationFn: ({ email, code }) => verifyResetCode(email, code),
    onSuccess: (data) => {
      if (data.valid) {
        setStep(3);
        toast.success('Code verified successfully!', {
          duration: 3000,
          icon: '✓',
        });
      } else {
        toast.error('Invalid or expired code', {
          duration: 4000,
          icon: '⚠️',
        });
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to verify code', {
        duration: 4000,
      });
    }
  });

  const resetMutation = useMutation({
    mutationFn: ({ email, code, newPassword }) => resetPassword(email, code, newPassword),
    onSuccess: () => {
      toast.success('Password reset successfully!', {
        duration: 4000,
        icon: '🔐',
      });
      setTimeout(() => onBack(), 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to reset password', {
        duration: 4000,
      });
    }
  });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    forgotMutation.mutate(email);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    verifyMutation.mutate({ email, code });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 4000,
        icon: '⚠️',
      });
      return;
    }
    resetMutation.mutate({ email, code, newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the 6-digit code sent to your email'}
            {step === 3 && 'Enter your new password'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {forgotMutation.isPending ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Enter new password"
                minLength="6"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}