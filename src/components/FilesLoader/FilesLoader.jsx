import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <div className=" w-screen h-screen absolute flex justify-center  items-center  bg-gray-700/50 z-50">
      <CircularProgress />
    </div>
  );
}