import { View, Text } from 'react-native'
import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { SQLiteProvider } from 'expo-sqlite';
import { setupDatabase } from '@/database/setup';

interface GlobalContextValues {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isLoadingUser: boolean;
  // TODO: add user
}

const GlobalContext = createContext<GlobalContextValues>({} as GlobalContextValues);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  // TODO: add user
  
  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoadingUser }}>
      <SQLiteProvider databaseName="gymrat-data.db" onInit={setupDatabase}>
        {children}
      </SQLiteProvider>
    </GlobalContext.Provider>
  )
}

export default GlobalProvider