import React, { useContext, createContext } from 'react'
import { fetchData } from '../services/backendApi';
export interface User {
  id: number;
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  Password: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Room {
  id: number;
  Name: string;
  RoomID: string;
  CreatedAt: number;
  CreatedBy: string;
  Creator: User;
  Status: string;
}


export interface CreateRoomRequest {
  name: string;
}


export type RoomContextType = {
  createRoom: (roomData: CreateRoomRequest) => Promise<CreateRoomRequest | undefined>;
  getRooms: () => Promise<Room[] | undefined>;
  getRoomById: (id: number) => Promise<Room | undefined>;
};

export const RoomContext = createContext<RoomContextType | undefined>(
  undefined
);


export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createRoom = async (roomData: CreateRoomRequest): Promise<CreateRoomRequest | undefined> => {
    try {
      const response = await fetchData.post("/rooms", roomData);
      if (response.status === 201) {
        return response.data as CreateRoomRequest;
      }
    } catch (err: unknown) {
      console.log("Error happened at createRoom function in roomContext file!", err);
      if (err instanceof Error) {
        console.log("Error happened at createRoom function in roomContext file!", err.message);
      } else {
        console.log("Error happened at createRoom function in roomContext file!", err);
      }
    }
  };

  const getRooms = async (): Promise<Room[] | undefined> => {
    try {
      const response = await fetchData.get("/rooms");
      if (response.status === 200) {
        console.log("Rooms fetched successfully!", response.data.rooms);
        return response.data.rooms as Room[];
      }
    } catch (err: unknown) {
      console.log("Error happened at getRooms function in roomContext file!", err);
      if (err instanceof Error) {
        console.log("Error happened at getRooms function in roomContext file!", err.message);
      } else {
        console.log("Error happened at getRooms function in roomContext file!", err);
      }
    }
  }

  const getRoomById = async (id: number): Promise<Room | undefined> => {
    try {
      const response = await fetchData.get(`/rooms/${id}`);
      if (response.status === 200) {
        return response.data.room as Room;
      }
    } catch (err: unknown) {
      console.log("Error happened at getRoomById function in roomContext file!", err);
      if (err instanceof Error) {
        console.log("Error happened at getRoomById function in roomContext file!", err.message);
      } else {
        console.log("Error happened at getRoomById function in roomContext file!", err);
      }

    }
  }

  return (
    <RoomContext.Provider value={{ createRoom, getRooms, getRoomById }}>
      {children}
    </RoomContext.Provider>
  );
}

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}