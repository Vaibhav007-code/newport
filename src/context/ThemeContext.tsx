import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    muted: string;
    surface: string;
    border: string;
    card: string;
    accent: string;
    hover: string;
  };
}

const notionDarkTheme = {
  background: 'bg-[#191919]',
  text: 'text-[#FFFFFF]',
  primary: 'text-[#2eaadc]',
  secondary: 'text-[#999999]',
  muted: 'text-[#666666]',
  surface: 'bg-[#202020]',
  border: 'border-[#333333]',
  card: 'bg-[#242424]',
  accent: 'text-[#2eaadc]',
  hover: 'hover:bg-[#2a2a2a]'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: notionDarkTheme,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: notionDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
