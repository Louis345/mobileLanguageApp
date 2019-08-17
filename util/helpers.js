const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
const GetTodayDayNumber = Math.round(new Date().getTime() / DAY_IN_MILISECONDS);
// eslint-disable-next-line import/prefer-default-export
export function DayNumberToMMDDYY(time) {
  const DateTime = new Date(parseInt(time * DAY_IN_MILISECONDS, 10));
  const dd = String(DateTime.getDate()).padStart(2, '0');
  const mm = String(DateTime.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = DateTime.getFullYear();
  const today = `${mm}/${dd}/${yyyy}`;
  return today;
}
