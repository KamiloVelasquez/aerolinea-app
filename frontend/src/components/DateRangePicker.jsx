import { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function DateRangePicker({ fechaIda, fechaVuelta, onSelectDates, isRoundTrip, isOpen, onClose }) {
  const { lang, t } = useContext(LanguageContext);

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (fechaIda) {
      const d = new Date(fechaIda + 'T00:00:00');
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [tempStart, setTempStart] = useState(fechaIda || '');
  const [tempEnd, setTempEnd] = useState(isRoundTrip ? (fechaVuelta || '') : '');
  const [hoverDate, setHoverDate] = useState('');
  const [selectingState, setSelectingState] = useState(fechaIda && !fechaVuelta && isRoundTrip ? 'end' : 'start');

  useEffect(() => {
    setTempStart(fechaIda || '');
    setTempEnd(isRoundTrip ? (fechaVuelta || '') : '');
    setSelectingState('start');
  }, [fechaIda, fechaVuelta, isRoundTrip, isOpen]);

  if (!isOpen) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Días de offset (0 = Lunes, 6 = Domingo)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const monthNamesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = (lang === 'ES' ? monthNamesEs : monthNamesEn)[month];

  const daysOfWeekEs = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  const daysOfWeekEn = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const daysOfWeek = lang === 'ES' ? daysOfWeekEs : daysOfWeekEn;

  const prevMonth = () => {
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const target = new Date(year, month - 1, 1);
    if (target >= minMonth) {
      setCurrentMonth(target);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDateStr = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const handleDayClick = (dateStr) => {
    const clickedDate = new Date(dateStr + 'T00:00:00');
    if (clickedDate < today) return;

    if (!isRoundTrip) {
      setTempStart(dateStr);
      setTempEnd('');
      onSelectDates({ fechaIda: dateStr, fechaVuelta: '' });
      onClose();
      return;
    }

    if (selectingState === 'start' || !tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd('');
      setSelectingState('end');
    } else if (selectingState === 'end') {
      const startDateObj = new Date(tempStart + 'T00:00:00');
      if (clickedDate < startDateObj) {
        setTempStart(dateStr);
        setTempEnd('');
        setSelectingState('end');
      } else {
        setTempEnd(dateStr);
        setSelectingState('start');
        onSelectDates({ fechaIda: tempStart, fechaVuelta: dateStr });
      }
    }
  };

  const calculateNights = () => {
    if (!tempStart || !tempEnd) return 0;
    const d1 = new Date(tempStart + 'T00:00:00');
    const d2 = new Date(tempEnd + 'T00:00:00');
    const diff = d2.getTime() - d1.getTime();
    return Math.max(0, Math.round(diff / (1000 * 3600 * 24)));
  };

  const handleConfirm = () => {
    if (tempStart) {
      let finalEnd = tempEnd;
      if (isRoundTrip && tempStart && !tempEnd) {
        // Auto-asignar regreso 7 días después si no seleccionó regreso
        const d = new Date(tempStart + 'T00:00:00');
        d.setDate(d.getDate() + 7);
        finalEnd = d.toISOString().slice(0, 10);
      }
      onSelectDates({ fechaIda: tempStart, fechaVuelta: isRoundTrip ? finalEnd : '' });
    }
    onClose();
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    setSelectingState('start');
  };

  // Construir celdas del calendario
  const calendarCells = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateStr(year, month, d);
    const cellDate = new Date(year, month, d);
    cellDate.setHours(0, 0, 0, 0);

    const isPast = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();

    const isStart = tempStart === dateStr;
    const isEnd = tempEnd === dateStr;

    let isInRange = false;
    let isHoverRange = false;

    if (tempStart && tempEnd) {
      isInRange = dateStr > tempStart && dateStr < tempEnd;
    } else if (tempStart && !tempEnd && hoverDate && isRoundTrip) {
      isHoverRange = dateStr > tempStart && dateStr <= hoverDate && hoverDate > tempStart;
    }

    let cellClass = 'calendar-day';
    if (isPast) cellClass += ' disabled';
    if (isToday) cellClass += ' today';
    if (isStart) cellClass += ' day-start';
    if (isEnd) cellClass += ' day-end';
    if (isInRange) cellClass += ' in-range';
    if (isHoverRange) cellClass += ' hover-range';

    calendarCells.push(
      <button
        key={dateStr}
        type="button"
        className={cellClass}
        disabled={isPast}
        onClick={() => handleDayClick(dateStr)}
        onMouseEnter={() => setHoverDate(dateStr)}
      >
        <span>{d}</span>
      </button>
    );
  }

  const nights = calculateNights();

  return (
    <div className="date-picker-backdrop" onClick={onClose}>
      <div className="date-picker-popover" onClick={(e) => e.stopPropagation()}>
        {/* Header con Estado tipo Booking */}
        <div className="dp-header">
          <div className="dp-title-block">
            <span className="dp-icon">📅</span>
            <div>
              <h4 className="dp-title">
                {isRoundTrip
                  ? (!tempStart
                      ? t('home.selectDeparture')
                      : (!tempEnd
                          ? t('home.selectReturn')
                          : (nights > 0 ? t('home.nightsCount', { count: nights }) : t('home.selectDatesTitle'))))
                  : t('home.selectSingleDate')}
              </h4>
              <p className="dp-subtitle">
                {tempStart ? tempStart : '----/--/--'}
                {isRoundTrip ? `  →  ${tempEnd ? tempEnd : '----/--/--'}` : ''}
              </p>
            </div>
          </div>
          <button type="button" className="dp-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Mes y Controles de Navegación */}
        <div className="dp-nav-bar">
          <button type="button" className="dp-nav-arrow" onClick={prevMonth} title="Mes anterior">
            ‹
          </button>
          <span className="dp-month-label">{currentMonthName} {year}</span>
          <button type="button" className="dp-nav-arrow" onClick={nextMonth} title="Mes siguiente">
            ›
          </button>
        </div>

        {/* Días de la semana */}
        <div className="dp-weekdays">
          {daysOfWeek.map((day, i) => (
            <span key={i} className="dp-weekday">{day}</span>
          ))}
        </div>

        {/* Grid de días del mes */}
        <div className="dp-grid">
          {calendarCells}
        </div>

        {/* Footer con Botones de Acción */}
        <div className="dp-footer">
          <button type="button" className="dp-btn-clear" onClick={handleClear}>
            {t('home.clearDates')}
          </button>
          <button type="button" className="btn-search dp-btn-confirm" onClick={handleConfirm}>
            {t('home.confirmDates')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateRangePicker;
