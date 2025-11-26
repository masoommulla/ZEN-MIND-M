import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, IndianRupee } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';

interface DurationSelectorProps {
  pricePerMinute: number;
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  className?: string;
}

export function DurationSelector({
  pricePerMinute,
  selectedDuration,
  onDurationChange,
  className = ''
}: DurationSelectorProps) {
  // Duration options: 15, 30, 45, 60 minutes
  const durationOptions = [15, 30, 45, 60];
  const durationIndex = durationOptions.indexOf(selectedDuration);
  
  const handleSliderChange = (value: number[]) => {
    const index = value[0];
    onDurationChange(durationOptions[index]);
  };

  const totalPrice = Math.ceil(pricePerMinute * selectedDuration);

  return (
    <Card className={`p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Session Duration</h3>
            <p className="text-sm text-gray-600">Choose how long you'd like to talk</p>
          </div>
        </div>

        {/* Duration Display */}
        <motion.div
          key={selectedDuration}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-4 bg-white rounded-xl shadow-sm border-2 border-purple-100"
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedDuration}
          </div>
          <div className="text-sm text-gray-600 mt-1">minutes</div>
        </motion.div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[durationIndex]}
            onValueChange={handleSliderChange}
            min={0}
            max={3}
            step={1}
            className="w-full"
          />
          
          {/* Duration Labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {durationOptions.map((duration) => (
              <span key={duration} className={selectedDuration === duration ? 'font-semibold text-purple-600' : ''}>
                {duration}m
              </span>
            ))}
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {durationOptions.map((duration) => (
            <motion.button
              key={duration}
              onClick={() => onDurationChange(duration)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedDuration === duration
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              {duration}m
            </motion.button>
          ))}
        </div>

        {/* Price Display */}
        <motion.div
          key={totalPrice}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Session Cost</p>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-5 h-5 text-green-600" />
                <span className="text-3xl font-bold text-green-600">{totalPrice}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Per minute rate</p>
              <p className="text-sm text-gray-700 font-medium">₹{pricePerMinute.toFixed(2)}/min</p>
            </div>
          </div>
          
          {/* Price breakdown */}
          <div className="mt-3 pt-3 border-t border-green-200">
            <p className="text-xs text-gray-600">
              {selectedDuration} minutes × ₹{pricePerMinute.toFixed(2)} = <span className="font-semibold text-green-600">₹{totalPrice}</span>
            </p>
          </div>
        </motion.div>

        {/* Info message */}
        <div className="flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            Sessions can be extended during the call if both parties agree. Flexible duration helps you get the support you need.
          </p>
        </div>
      </div>
    </Card>
  );
}
