import React from 'react'
import { MoonLoader, SyncLoader } from 'react-spinners'

// #ea580c orange
// #2563eb blue
const ORANGE = "#ea580c"
const BLUE = "#2563eb"

function Spinner({ size=40 }) {
  return (
    <div className='flex flex-1 justify-center items-center h-full bg-transparent'>
        <MoonLoader size={size} speedMultiplier={0.9} color={BLUE} />
    </div>
  )
}

export default Spinner
