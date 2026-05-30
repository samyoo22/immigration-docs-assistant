import React, { useMemo } from 'react';
import { CalendarClock, Info, ListChecks } from 'lucide-react';
import { calculateF1OptTimeline, formatDateLong, parseLocalDate } from '../../lib/roadmaps/dateUtils';

interface OptDateCalculatorProps {
  programEndDate: string;
  desiredOptStartDate: string;
  dsoRecommendationDate: string;
  hasGeneratedTimeline: boolean;
  onProgramEndDateChange: (value: string) => void;
  onDesiredOptStartDateChange: (value: string) => void;
  onDsoRecommendationDateChange: (value: string) => void;
  onGenerateTimeline: () => void;
}

const OptDateCalculator: React.FC<OptDateCalculatorProps> = ({
  programEndDate,
  desiredOptStartDate,
  dsoRecommendationDate,
  hasGeneratedTimeline,
  onProgramEndDateChange,
  onDesiredOptStartDateChange,
  onDsoRecommendationDateChange,
  onGenerateTimeline,
}) => {
  const result = useMemo(
    () =>
      calculateF1OptTimeline({
        programEndDate,
        desiredOptStartDate,
        dsoRecommendationDate,
      }),
    [programEndDate, desiredOptStartDate, dsoRecommendationDate]
  );

  const programEnd = parseLocalDate(programEndDate);
  const dsoRecommendation = parseLocalDate(dsoRecommendationDate);
  const showResults = hasGeneratedTimeline && Boolean(programEndDate);

  return (
    <section id="opt-date-calculator" className="border-t border-slate-200 py-10 scroll-mt-24">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr),minmax(420px,1.12fr)] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Date calculator</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">Understand your general OPT timeline</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your program end date and we’ll help you understand your general OPT filing window and OPT start date range.
          </p>

          <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <p className="text-sm leading-6 text-sky-900">
                This is a planning estimate. Confirm exact dates with your DSO and official sources.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-sky-700" />
              <p className="text-sm font-semibold text-slate-950">This calculator helps estimate</p>
            </div>
            <div className="space-y-2 text-sm leading-6 text-slate-600">
              <p>General Form I-765 filing window</p>
              <p>General OPT start date range</p>
              <p>DSO recommendation filing reminder, when available</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">Step 1: Enter your dates</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <DateField label="Program end date" value={programEndDate} onChange={onProgramEndDateChange} />
              <DateField label="Desired OPT start date" value={desiredOptStartDate} onChange={onDesiredOptStartDateChange} />
              <div className="sm:col-span-2">
                <DateField
                  label="DSO recommendation date"
                  value={dsoRecommendationDate}
                  onChange={onDsoRecommendationDateChange}
                  optional
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onGenerateTimeline}
              onMouseDown={onGenerateTimeline}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-700/15 transition hover:bg-sky-800 active:scale-[0.99] sm:w-auto"
            >
              <CalendarClock className="h-4 w-4" />
              Generate Timeline
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">Step 2: Results</p>
            {!showResults ? (
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-5">
                <p className="text-base font-semibold text-slate-950">No timeline yet</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Enter your program end date to see your general filing window and OPT start date range.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DateResult title="Earliest recommended filing date" value={formatDateLong(result.earliestRecommendedFilingDate)} />
                  <DateResult title="Latest possible filing date" value={formatDateLong(result.latestPossibleFilingDate)} />
                  <DateResult
                    title="OPT start date window"
                    value={
                      result.optStartDateWindow
                        ? `${formatDateLong(result.optStartDateWindow.start)} to ${formatDateLong(result.optStartDateWindow.end)}`
                        : 'Calculated after program end date'
                    }
                  />
                  <DateResult
                    title="DSO recommendation reminder"
                    value={
                      result.dsoRecommendationDeadline
                        ? formatDateLong(result.dsoRecommendationDeadline)
                        : 'Add DSO recommendation date when available.'
                    }
                  />
                </div>

                <TimelineResult
                  programEndDate={programEnd}
                  dsoRecommendationDate={dsoRecommendation}
                  earliestFilingDate={result.earliestRecommendedFilingDate}
                  latestFilingDate={result.latestPossibleFilingDate}
                  optStartDateWindow={result.optStartDateWindow}
                />

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
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineResult: React.FC<{
  programEndDate?: Date;
  dsoRecommendationDate?: Date;
  earliestFilingDate?: Date;
  latestFilingDate?: Date;
  optStartDateWindow?: { start: Date; end: Date };
}> = ({ programEndDate, dsoRecommendationDate, earliestFilingDate, latestFilingDate, optStartDateWindow }) => {
  const timelineItems = [
    { label: 'Earliest filing date', value: formatDateLong(earliestFilingDate), risk: false },
    { label: 'Program end date', value: formatDateLong(programEndDate), risk: false },
    {
      label: 'OPT start date window',
      value: optStartDateWindow
        ? `${formatDateLong(optStartDateWindow.start)} to ${formatDateLong(optStartDateWindow.end)}`
        : 'Calculated after program end date',
      risk: false,
    },
    { label: 'Latest filing date', value: formatDateLong(latestFilingDate), risk: true },
  ];

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">Timeline view</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        {timelineItems.map((item, index) => (
          <div key={item.label} className="relative rounded-2xl bg-white p-4 shadow-sm">
            {index < timelineItems.length - 1 && (
              <div className="absolute left-8 top-12 h-[calc(100%+0.75rem)] w-px bg-sky-100 lg:left-auto lg:right-[-0.4rem] lg:top-8 lg:h-px lg:w-3" />
            )}
            <span
              className={`relative inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                item.risk ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
              }`}
            >
              {item.risk ? 'Deadline' : 'Planning date'}
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-950">{item.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      {dsoRecommendationDate && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          DSO recommendation date: {formatDateLong(dsoRecommendationDate)}. File Form I-765 generally within 30 days after DSO recommendation.
        </div>
      )}
    </div>
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
      onChange={(event) => {
        onChange(event.target.value);
      }}
      onInput={(event) => {
        onChange(event.currentTarget.value);
      }}
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
