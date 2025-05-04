
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
  dates: DateRange | undefined;
  onDatesChange: (dates: DateRange | undefined) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dates,
  onDatesChange
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">When are you traveling?</label>
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-start text-left font-normal rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 ${!dates?.from && !dates?.to ? 'text-gray-500' : 'text-gray-800'}`}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <CalendarIcon size={16} className="mr-2 text-purple-500" />
        {dates?.from && dates?.to ? (
          `${dates.from.toLocaleDateString()} - ${dates.to.toLocaleDateString()}`
        ) : (
          "Select dates"
        )}
      </Button>
      
      {showCalendar && (
        <div className="mt-2 border border-gray-200 rounded-xl p-3 bg-white ios-shadow">
          <Calendar
            mode="range"
            selected={dates}
            onSelect={(range) => {
              onDatesChange(range);
              if (range?.from && range?.to) {
                setShowCalendar(false);
              }
            }}
            className="rounded-md pointer-events-auto"
            numberOfMonths={1}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
