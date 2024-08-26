import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { SQLiteProvider } from 'expo-sqlite';
import { setupDatabase } from '@/database/setup';
import axios from "axios";

interface GlobalContextValues {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextValues>({} as GlobalContextValues);

export const useGlobalContext = () => useContext(GlobalContext);

const url = process.env.EXPO_PUBLIC_API_URL!;
const data = {
  userId: "128aw79awd78dadw2d91",
  name: "Push Day",
  days: [1, 4],
  setGroups: [
    {
      exerciseIds: [0],
      rest: 60,
      notes: "Some notes and stuff"
    }
  ],
  sets: [
    {
      exerciseId: 0,
      type: "Warm",
      weight: 90
    },
    {
      exerciseId: 0,
      type: "Standard",
      weight: 80
    },
    {
      exerciseId: 0,
      type: "Drop",
      weight: 70
    }
  ]
}

const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`${url}/workouts/66caed19dce8437cab93f551`)
      .then(res => {
        console.log("Success:", JSON.stringify(res.data, null, 2));
      })
      .catch(error => {
        console.error("Error:", error);
      })
  }, []);
  
  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
      <SQLiteProvider databaseName="gymrat-data.db" onInit={setupDatabase}>
        {children}
      </SQLiteProvider>
    </GlobalContext.Provider>
  );
}

export default GlobalProvider