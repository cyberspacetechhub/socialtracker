import { useState, useEffect } from 'react';
import { useProfile } from '../services/queries';

const motivationalMessages = [
  "🌟 Every moment offline is a moment for real connections!",
  "💪 You're building stronger focus habits every day!",
  "🎯 Small steps lead to big changes in digital wellness!",
  "🌱 Your mindful usage is growing into healthier habits!",
  "✨ Taking breaks from social media boosts creativity!",
  "🧠 Your brain thanks you for these digital detox moments!",
  "🏆 Consistency in limits leads to lasting change!",
  "🌈 Balance is the key to a healthier digital life!",
  "💡 Awareness is the first step to transformation!",
  "🎉 Celebrate every small victory in your digital journey!"
];

export default function MotivationalMessage() {
  const { data: user } = useProfile();
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user?.preferences?.motivationalMessages) return;

    const showMessage = () => {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setCurrentMessage(randomMessage);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    };

    // Show message immediately
    showMessage();
    
    // Show new message every 10 minutes
    const interval = setInterval(showMessage, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user?.preferences?.motivationalMessages]);

  if (!isVisible || !user?.preferences?.motivationalMessages) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium pr-2">{currentMessage}</p>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}