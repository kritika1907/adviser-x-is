import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

const ScheduleModal = ({ isOpen, onClose,serviceData, adviserData ,formik}) => {
  const [selectedDate, setSelectedDate] = useState(0);

  const auth= getAuth();

  const [validDays, setValidDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [selectedIndexDay, setSelectedIndexDay] = useState(null);
  const [selectedIndexTime, setSelectedIndexTime] = useState(null);



  const days = getNext20Days(); // Your function to get the next 20 days
  const visibleDays = 5;




  function getNext20Days() {
    const daysArray = [];
    const options = { weekday: 'short', day: 'numeric', month: 'long' };
  
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const formattedDate = date.toLocaleDateString('en-US', options);
      daysArray.push(formattedDate);
    }
  
    return daysArray;
  }



function filterDays(arrayOfDays, dayObjects) {
    const dayMap = {
        "Sun": "Sunday",
        "Mon": "Monday",
        "Tue": "Tuesday",
        "Wed": "Wednesday",
        "Thu": "Thursday",
        "Fri": "Friday",
        "Sat": "Saturday"
    };

    // Extract the days from dayObjects into a set
    const validDaysSet = new Set(dayObjects.map(dayObj => dayObj.day));

    // Filter arrayOfDays based on validDaysSet
    const filteredDays = arrayOfDays.filter(dayStr => {
        const dayAbbr = dayStr.split(',')[0]; // Get the day abbreviation
        const fullDay = dayMap[dayAbbr]; // Map to full day name
        return validDaysSet.has(fullDay); // Check if the day is in the validDaysSet
    });

    return filteredDays;
}



function divideslots(timeRange, duration) {
    // Function to convert 12-hour AM/PM time to minutes since midnight
    const timeToMinutes = (time12) => {
        const [timePart, period] = time12.split(' ');
        let [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));
        
        if (period === 'PM' && hours < 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    };

    // Function to convert minutes since midnight to 12-hour AM/PM format
    const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = ((hours % 12) || 12).toString().padStart(2, '0');
        return `${formattedHours}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    // Extract start and end times from the time range
    const [startTime, endTime] = timeRange.split('-').map(time => time.trim());
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Generate time slots based on the duration
    const slots = [];
    let currentMinutes = startMinutes;
    while (currentMinutes + duration <= endMinutes) {
        slots.push(minutesToTime(currentMinutes));
        currentMinutes += duration;
    }

    return slots;
}

function convertDateToISO(dateString) {
    const [dayOfWeek, monthDay] = dateString.split(',').map(part => part.trim());
    const [month, day] = monthDay.split(' ').filter(Boolean);
    const currentYear = new Date().getFullYear();

    const monthMap = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12"
    };

    const monthNumber = monthMap[month];
    const dayNumber = day.padStart(2, '0');

    return `${currentYear}-${monthNumber}-${dayNumber}`;
}


 const generateTimeSlots = (day, availability, duration) =>{
           const dayMap = {
        "Sun": "Sunday",
        "Mon": "Monday",
        "Tue": "Tuesday",
        "Wed": "Wednesday",
        "Thu": "Thursday",
        "Fri": "Friday",
        "Sat": "Saturday"
    };

    {
      availability &&      availability.map((item, idx)=>{
        if(item.day === dayMap[day])
            {
                setTimeSlots(divideslots(item.timing, duration))
            }
    })
    }


 }


const handleClickOnDay = (dayString,index) =>{
    setSelectedIndexDay(index)
    const day = dayString.split(',')[0]

    generateTimeSlots(day, adviserData.availability, serviceData.duration)

    setDate(convertDateToISO(dayString))

    // console.log("timeSlots", timeslot)
}

const handleClickOnTime = (index,time) =>{
    setSelectedIndexTime(index)
    setTime(time)
}



  const handlePrev = () => {
    setSelectedDate((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setSelectedDate((prev) => Math.min(prev + 1, days.length - visibleDays));
  };

  const handleSubmit = () =>{
    // formik.setFieldValue("date", date)
    // formik.setFieldValue("time", time)
    formik.setValues({
        ...formik.values,
        date,
        time
      });
    onClose()
  }

  useEffect(()=>{

    if(adviserData && adviserData.availability)
        {
            setValidDays(filterDays(days,adviserData.availability))
        }
  
  },[adviserData])

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 md:w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Select Date</h2>
        <div className="flex items-center mb-4">
          <button onClick={handlePrev} className="p-2" type='button'>
            ◀
          </button>
          <div className="flex overflow-hidden">
            {validDays.slice(selectedDate, selectedDate + visibleDays).map((day, index) => (
              <div
                key={index}
                className={`p-2 mx-1 cursor-pointer rounded ${
                  index === selectedIndexDay ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={()=> handleClickOnDay(day,index)}
              >
                {day}
              </div>
            ))}
          </div>
          <button onClick={handleNext} className="p-2" type="button">
            ▶
          </button>
        </div>
        <h3 className="text-lg mb-2">Select time of day</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {timeSlots.map((time, index) => (
            <div key={index} className={`p-2 text-center border rounded cursor-pointer ${
                index === selectedIndexTime ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`} onClick={()=>handleClickOnTime(index,time)}>
              {time}
            </div>
          ))}
        </div>

        <button className="bg-[#489CFF] text-white py-2 px-4 rounded w-full"  type="button" onClick={handleSubmit}>
          Book Slot
        </button>
        <button className="bg-[#FF5348] text-white py-2 px-4 rounded w-full my-2" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  ) : null;
};

export default ScheduleModal;