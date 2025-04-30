
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SeatSelectionProps {
  maxSeats: number;
  onSelect: (selectedSeats: string[]) => void;
  onClose: () => void;
}

const SeatSelection = ({ maxSeats, onSelect, onClose }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 4; // 2 seats on each side of aisle
  
  // Generate seat availability - in a real app, this would come from the API
  const [seatStatus, setSeatStatus] = useState<Record<string, 'available' | 'booked' | 'selected'>>(() => {
    const initialStatus: Record<string, 'available' | 'booked' | 'selected'> = {};
    
    // Mark some random seats as booked for demo purposes
    seatRows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        initialStatus[seatId] = Math.random() > 0.8 ? 'booked' : 'available';
      }
    });
    
    return initialStatus;
  });
  
  const toggleSeatSelection = (seatId: string) => {
    if (seatStatus[seatId] === 'booked') return;
    
    setSelectedSeats(prev => {
      // If already selected, remove it
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      
      // If reached max seats, don't allow more selections
      if (prev.length >= maxSeats) {
        return prev;
      }
      
      // Add the seat
      return [...prev, seatId];
    });
  };
  
  const handleConfirm = () => {
    onSelect(selectedSeats);
    onClose();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
        <CardDescription>
          Please select up to {maxSeats} seats for your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="flex gap-3 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-sm mr-1"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-smartbus-blue rounded-sm mr-1"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-sm mr-1"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-3">
          <div className="w-16 h-6 bg-gray-300 rounded-t-lg flex items-center justify-center text-xs font-medium">
            FRONT
          </div>
        </div>
        
        <div className="space-y-2">
          {seatRows.map(row => (
            <div key={row} className="flex justify-center gap-8">
              <div className="flex gap-2">
                {[1, 2].map(num => {
                  const seatId = `${row}${num}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isBooked = seatStatus[seatId] === 'booked';
                  
                  return (
                    <button
                      key={seatId}
                      className={cn(
                        "w-8 h-8 rounded-t-lg flex items-center justify-center text-xs font-medium transition-colors",
                        isBooked ? "bg-gray-400 cursor-not-allowed" : 
                        isSelected ? "bg-smartbus-blue text-white" : 
                        "bg-gray-200 hover:bg-gray-300"
                      )}
                      onClick={() => toggleSeatSelection(seatId)}
                      disabled={isBooked}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex gap-2">
                {[3, 4].map(num => {
                  const seatId = `${row}${num}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isBooked = seatStatus[seatId] === 'booked';
                  
                  return (
                    <button
                      key={seatId}
                      className={cn(
                        "w-8 h-8 rounded-t-lg flex items-center justify-center text-xs font-medium transition-colors",
                        isBooked ? "bg-gray-400 cursor-not-allowed" : 
                        isSelected ? "bg-smartbus-blue text-white" : 
                        "bg-gray-200 hover:bg-gray-300"
                      )}
                      onClick={() => toggleSeatSelection(seatId)}
                      disabled={isBooked}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {selectedSeats.length} / {maxSeats} seats selected
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0}
          >
            Confirm Selection
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SeatSelection;
