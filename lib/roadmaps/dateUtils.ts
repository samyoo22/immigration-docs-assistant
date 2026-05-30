export interface F1OptDateInputs {
  programEndDate?: string;
  desiredOptStartDate?: string;
  dsoRecommendationDate?: string;
}

export interface DateWindow {
  start: Date;
  end: Date;
}

export interface F1OptTimelineResult {
  earliestRecommendedFilingDate?: Date;
  latestPossibleFilingDate?: Date;
  optStartDateWindow?: DateWindow;
  dsoRecommendationDeadline?: Date;
  desiredStartDateMessage?: string;
  guidance: string[];
}

const oneDayMs = 24 * 60 * 60 * 1000;

export const parseLocalDate = (value?: string): Date | undefined => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const formatDateLong = (date?: Date): string => {
  if (!date) return 'Add a date to calculate this.';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const minDate = (first: Date, second: Date): Date => (first.getTime() <= second.getTime() ? first : second);

const isWithinWindow = (date: Date, window: DateWindow): boolean =>
  date.getTime() >= window.start.getTime() && date.getTime() <= window.end.getTime();

export const calculateF1OptTimeline = ({
  programEndDate,
  desiredOptStartDate,
  dsoRecommendationDate,
}: F1OptDateInputs): F1OptTimelineResult => {
  const programEnd = parseLocalDate(programEndDate);
  const desiredStart = parseLocalDate(desiredOptStartDate);
  const dsoRecommendation = parseLocalDate(dsoRecommendationDate);
  const guidance: string[] = [];

  if (!programEnd) {
    return {
      guidance: [
        'Enter your program end date first. That date anchors the general OPT filing window and OPT start date window.',
      ],
    };
  }

  const earliestRecommendedFilingDate = addDays(programEnd, -90);
  const sixtyDaysAfterProgramEnd = addDays(programEnd, 60);
  const optStartDateWindow = {
    start: addDays(programEnd, 1),
    end: sixtyDaysAfterProgramEnd,
  };

  const dsoRecommendationDeadline = dsoRecommendation ? addDays(dsoRecommendation, 30) : undefined;
  const latestPossibleFilingDate = dsoRecommendationDeadline
    ? minDate(sixtyDaysAfterProgramEnd, dsoRecommendationDeadline)
    : sixtyDaysAfterProgramEnd;

  if (!dsoRecommendation) {
    guidance.push('Add your DSO recommendation date when you have it so you can watch the general 30-day filing reminder.');
  }

  let desiredStartDateMessage: string | undefined;
  if (!desiredStart) {
    desiredStartDateMessage = 'Add a desired OPT start date to compare it with the general start-date window.';
  } else if (isWithinWindow(desiredStart, optStartDateWindow)) {
    desiredStartDateMessage = 'Your desired start date appears to fall within the general post-completion OPT start-date window.';
  } else {
    desiredStartDateMessage =
      'Your desired start date appears outside the general post-completion OPT start-date window. Confirm your plan with your DSO.';
  }

  if (Math.round((latestPossibleFilingDate.getTime() - earliestRecommendedFilingDate.getTime()) / oneDayMs) < 0) {
    guidance.push('The DSO recommendation date makes the filing reminder earlier than the usual opening date. Please review this with your DSO.');
  }

  guidance.push('These dates are general planning helpers, not a legal determination.');

  return {
    earliestRecommendedFilingDate,
    latestPossibleFilingDate,
    optStartDateWindow,
    dsoRecommendationDeadline,
    desiredStartDateMessage,
    guidance,
  };
};
