"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Movie } from "@/types/movie";

interface MovieContextProps {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie) => void;
}

const MovieContext = createContext<MovieContextProps | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  return (
    <MovieContext.Provider value={{ selectedMovie, setSelectedMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error("useMovieContext must be used within MovieProvider");
  return context;
};
