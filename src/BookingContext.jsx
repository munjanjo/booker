import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]); // [{id,name,durationMinutes,price}]
  const [selectedProfessional, setSelectedProfessional] = useState(null); // {id,name}
  const [selectedDateTime, setSelectedDateTime] = useState(null); // ISO string

  const resetBooking = () => {
    setSelectedSalon(null);
    setSelectedServices([]);
    setSelectedProfessional(null);
    setSelectedDateTime(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSalon,
        setSelectedSalon,
        selectedServices,
        setSelectedServices,
        selectedProfessional,
        setSelectedProfessional,
        selectedDateTime,
        setSelectedDateTime,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
