import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, ArrowRight, Check } from 'lucide-react';
import Button from '../components/Button';

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

const BookCall: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notes: ''
  });

  // Calendar Logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addDays(monthEnd, 1));
  const prevMonth = () => setCurrentMonth(addDays(monthStart, -1));

  const handleNextStep = () => {
    if (step === 1 && selectedDate && selectedTime) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success state
    console.log("Booking:", { selectedDate, selectedTime, ...formData });
  };

  return (
    <section className="pt-24 md:pt-36 pb-20 px-6 md:px-12 max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <span className="text-lime-500 font-semibold tracking-widest uppercase text-sm mb-4 block">Schedule a Meeting</span>
        <h1 className="font-serif-display text-4xl md:text-6xl text-charcoal mb-4">
            {step === 3 ? "Booking Confirmed" : "Book a Discovery Call"}
        </h1>
        {step !== 3 && (
            <p className="text-gray-500 max-w-xl mx-auto">
            Let's discuss how we can elevate your brand. Choose a time that works best for you.
            </p>
        )}
      </motion.div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 border border-charcoal/5 min-h-[600px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CALENDAR & TIME */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full"
            >
              {/* Calendar Section */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif-display text-charcoal">{format(currentMonth, 'MMMM yyyy')}</h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-beige-100 rounded-full transition-colors text-charcoal/60 hover:text-charcoal">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-beige-100 rounded-full transition-colors text-charcoal/60 hover:text-charcoal">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-xs font-semibold text-gray-400 uppercase tracking-widest py-2">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2">
                    {calendarDays.map((day, idx) => {
                         const isSelected = selectedDate && isSameDay(day, selectedDate);
                         const isCurrentMonth = isSameMonth(day, currentMonth);
                         const isTodayDate = isToday(day);

                         return (
                            <div key={idx} className="flex justify-center">
                                <button
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                                        ${!isCurrentMonth ? 'text-gray-300' : 'text-charcoal'}
                                        ${isSelected ? 'bg-charcoal text-white scale-110 shadow-lg' : 'hover:bg-lime-100'}
                                        ${isTodayDate && !isSelected ? 'border border-lime-400 text-lime-600' : ''}
                                    `}
                                >
                                    {format(day, 'd')}
                                </button>
                            </div>
                         );
                    })}
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-8 lg:pt-0 lg:pl-12 flex flex-col h-full">
                <div className="mb-6">
                    <h3 className="text-xl font-serif-display text-charcoal mb-2">Select a Time</h3>
                    <p className="text-sm text-gray-500">
                        {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : 'Please select a date first'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {TIME_SLOTS.map((time) => (
                        <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            disabled={!selectedDate}
                            className={`
                                py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200
                                ${selectedTime === time 
                                    ? 'bg-lime-400 border-lime-400 text-charcoal shadow-md scale-[1.02]' 
                                    : 'border-gray-200 text-gray-600 hover:border-lime-400 hover:bg-lime-50/50'
                                }
                                ${!selectedDate && 'opacity-50 cursor-not-allowed'}
                            `}
                        >
                            {time}
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-8">
                     <Button 
                        variant={selectedDate && selectedTime ? 'primary' : 'outline'}
                        className={`w-full flex items-center justify-center gap-2 ${!selectedDate || !selectedTime ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={handleNextStep}
                     >
                        NEXT STEP <ArrowRight size={18} />
                     </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DETAILS FORM */}
          {step === 2 && (
             <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl mx-auto h-full flex flex-col"
             >
                <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
                     <div className="flex items-center gap-4 text-sm text-gray-500">
                         <div className="flex items-center gap-2">
                            <CalendarIcon size={16} />
                            <span>{selectedDate && format(selectedDate, 'MMM do, yyyy')}</span>
                         </div>
                         <div className="w-1 h-1 bg-gray-300 rounded-full" />
                         <div className="flex items-center gap-2">
                             <Clock size={16} />
                             <span>{selectedTime}</span>
                         </div>
                     </div>
                     <button onClick={() => setStep(1)} className="text-xs font-semibold text-lime-600 hover:text-lime-700 underline uppercase tracking-wider">Change</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Name</label>
                             <input 
                                required
                                type="text" 
                                className="w-full bg-beige-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                             />
                        </div>
                        <div className="group">
                             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                             <input 
                                required
                                type="email" 
                                className="w-full bg-beige-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                             />
                        </div>
                    </div>
                     <div className="group">
                             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Company Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-beige-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                             />
                     </div>
                     <div className="group">
                             <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Anything else?</label>
                             <textarea 
                                rows={4}
                                className="w-full bg-beige-50 border border-gray-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all resize-none"
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                             />
                     </div>

                     <div className="pt-4">
                        <Button variant="primary" className="w-full bg-charcoal text-white hover:bg-black flex justify-center items-center gap-2">
                             ADD EVENT
                        </Button>
                     </div>
                </form>
             </motion.div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
             <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
             >
                <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-lime-200">
                    <Check size={40} className="text-charcoal" />
                </div>
                <h2 className="font-serif-display text-4xl text-charcoal mb-4">You're all set!</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    A calendar invitation has been sent to <span className="text-charcoal font-semibold">{formData.email}</span>. We look forward to chatting with you.
                </p>
                <div className="bg-beige-50 p-6 rounded-2xl border border-dashed border-charcoal/20 inline-flex flex-col items-center gap-2 mb-8">
                     <div className="text-sm uppercase tracking-widest text-gray-400 font-bold">Your Slot</div>
                     <div className="text-2xl font-serif-display text-charcoal">
                        {selectedDate && format(selectedDate, 'MMMM do')} at {selectedTime}
                     </div>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    BACK TO HOME
                </Button>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
};

export default BookCall;
