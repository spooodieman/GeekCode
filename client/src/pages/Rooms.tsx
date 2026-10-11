import { useEffect, useState } from 'react'
import { useRoom, type Room } from '@/context/RoomContext'

// Rooms page â€“ Traveler DNA profile wizard and session timeline
// spooodieman Â· Oct 2026
export default function Rooms() {
  const { getRooms } = useRoom()
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    getRooms?.().then((r) => setRooms(r ?? []))
  }, [getRooms])

  return (
    <div className='min-h-screen bg-gray-950 text-white p-8'>
      <h1 className='text-3xl font-bold mb-6 gradient-text'>My Rooms</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {rooms.map((room) => (
          <div key={room.RoomID} className='glass rounded-2xl p-6'>
            <h2 className='text-lg font-semibold'>{room.Name}</h2>
            <p className='text-gray-400 text-sm mt-1'>ID: {room.RoomID.slice(0, 8)}</p>
          </div>
        ))}
        {rooms.length === 0 && (
          <p className='text-gray-500 col-span-3 text-center py-20'>No rooms yet. Create one!</p>
        )}
      </div>
    </div>
  )
}