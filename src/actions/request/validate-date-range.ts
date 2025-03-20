type validateDateRangeType = {
  startDate: Date;
  endDate: Date;
};

export const validateDateRange = ({
  startDate,
  endDate,
}: validateDateRangeType) => startDate > endDate;
