import { useState } from 'react';
import { useProfile } from '../services/queries';
import { useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { showToast } from '../utils/notifications';

export default function PreferencesPanel() {
  const { data: user } = useProfile();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState({
    studySchedule: {
      enabled: user?.preferences?.studySchedule?.enabled || false,
      startTime: user?.preferences?.studySchedule?.startTime || '09:00',
      endTime: user?.preferences?.studySchedule?.endTime || '17:00',
      days: user?.preferences?.studySchedule?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    reminders: {
      breakReminders: user?.preferences?.reminders?.breakReminders ?? true,
      dailyGoals: user?.preferences?.reminders?.dailyGoals ?? true,
      weeklyReports: user?.preferences?.reminders?.weeklyReports ?? true
    },
    motivationalMessages: user?.preferences?.motivationalMessages ?? true
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/users/preferences', { preferences });
      queryClient.invalidateQueries(['profile']);
      showToast('Preferences updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const dayLabels = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">⚙️ Preferences</h3>
      
      {/* Study Schedule */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Study Schedule</h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.studySchedule.enabled}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                studySchedule: { ...prev.studySchedule, enabled: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable study schedule blocking</span>
          </label>
          
          {preferences.studySchedule.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={preferences.studySchedule.startTime}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      studySchedule: { ...prev.studySchedule, startTime: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={preferences.studySchedule.endTime}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      studySchedule: { ...prev.studySchedule, endTime: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(dayLabels).map(([key, label]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.studySchedule.days.includes(key)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...preferences.studySchedule.days, key]
                            : preferences.studySchedule.days.filter(d => d !== key);
                          setPreferences(prev => ({
                            ...prev,
                            studySchedule: { ...prev.studySchedule, days: newDays }
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reminders */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Reminders</h4>
        <div className="space-y-3">
          {Object.entries(preferences.reminders).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  reminders: { ...prev.reminders, [key]: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {key === 'breakReminders' && 'Break reminders'}
                {key === 'dailyGoals' && 'Daily goal notifications'}
                {key === 'weeklyReports' && 'Weekly usage reports'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={preferences.motivationalMessages}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              motivationalMessages: e.target.checked
            }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show motivational messages</span>
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}