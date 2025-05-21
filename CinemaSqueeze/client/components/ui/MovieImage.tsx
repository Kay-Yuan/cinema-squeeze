'use client';

import { Movie } from '@/types/movie';
import { useState } from 'react';

type Props = {
  movie?: Movie;
};

export default function MovieImage({ movie }: Props) {
  const fallback = '/No-Image-Placeholder.svg';
  const [imgSrc, setImgSrc] = useState(movie?.poster || fallback);

  return (
    <img
        src={imgSrc}
        alt={movie?.title || "No Image"}
        className="object-cover w-full h-full"
        onError={() => {
        setImgSrc(fallback)
        }}
    />
  );
}

export { MovieImage };