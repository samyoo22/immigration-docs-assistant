import React, { useMemo, useState } from 'react';
import { CalendarClock, Info } from 'lucide-react';
import { calculateF1OptTimeline, formatDateLong } from '../../lib/roadmaps/dateUtils';

const OptDateCalculator: React.FC = () => {
  const [programEndDate, setProgramEndDate] = useState('');
  const [desiredOptStartDate, setDesiredOptStartDate] = useState('');
  const [dsoRecommendationDate, setDsoRecommendationDate] = useState('');

  const result = useMemo(
    () =>
      calculateF1OptTimeline({
        programEndDate,
        desiredOptStartDate,
        dsoRecommendationDate,
      }),
    [programEndDate, desiredOptStartDate, dsoRecommendationDate]
  );

  return (
    <section className="border-t border-slate-200 py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr),minmax(360px,1.1fr)] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Date calculator</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Understand your general OPT timeline</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your program end date and we’ll help you understand your general OPT timeline.
          </p>
          <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p className="text-sm leading-6 text-sky-900">
                This is a planning helper. Confirm exact dates and requirements with your DSO and official sources before filing.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <DateField label="Program end date" value={programEndDate} onChange={setProgramEndDate} />
            <DateField label="Desired OPT start date" value={desiredOptStartDate} onChange={setDesiredOptStartDate} />
            <DateField
              label="DSO recommendation date"
              value={dsoRecommendationDate}
              onChange={setDsoRecommendationDate}
              optional
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DateResult
              title="Earliest recommended filing date"
              value={formatDateLong(result.earliestRecommendedFilingDate)}
            />
            <DateResult title="Latest possible filing date" value={formatDateLong(result.latestPossibleFilingDate)} />
            <DateResult
              title="OPT start date window"
              value={
                result.optStartDateWindow
                  ? `${formatDateLong(result.optStartDateWindow.start)} to ${formatDateLong(result.optStartDateWindow.end)}`
                  : 'Add a program end date to calculate this.'
              }
            />
            <DateResult
              title="DSO recommendation deadline reminder"
              value={formatDateLong(result.dsoRecommendationDeadline)}
            />
          </div>

          {result.desiredStartDateMessage && (
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {result.desiredStartDateMessage}
            </div>
          )}

          <div className="mt-4 space-y-2">
            {result.guidance.map((guidance) => (
              <div key={guidance} className="flex gap-2 text-sm leading-6 text-slate-600">
                <CalendarClock className="mt-1 h-4 w-4 shrink-0 text-sky-700" />
                <span>{guidance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DateField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
}> = ({ label, value, onChange, optional = false }) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      {label}
      {optional && <span className="normal-case tracking-normal text-slate-400"> optional</span>}
    </span>
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  </label>
);

const DateResult: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
    <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{value}</p>
  </div>
);

export default OptDateCalculator;
