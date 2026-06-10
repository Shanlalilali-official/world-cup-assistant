import { useTranslation } from 'react-i18next';
import { TOURNAMENT } from '../../utils/constants';
import { getTournamentDates, getToday, formatDate } from '../../utils/helpers';

export default function DateFilter({ selectedDate, onDateChange }) {
  const { t } = useTranslation();

  const dates = getTournamentDates();
  const today = getToday();

  // Show dates around the selected date
  const selectedIdx = dates.indexOf(selectedDate);
  const startIdx = Math.max(0, selectedIdx - 3);
  const endIdx = Math.min(dates.length, selectedIdx + 3);
  const visibleDates = dates.slice(startIdx, endIdx + 4);

  return (
    <div className="mb-6">
      <label className="block text-sm text-gray-400 mb-2">
        {t('schedule.filterByDate')}
      </label>
      <div className="flex flex-wrap gap-2">
        {visibleDates.map((date) => {
          const isToday = date === today;
          const isSelected = date === selectedDate;
          const d = new Date(date);

          return (
            <button
              key={date}
              onClick={() => onDateChange(date)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : isToday
                  ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="text-center">
                <div className="text-xs opacity-75">
                  {d.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <div>
                  {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
