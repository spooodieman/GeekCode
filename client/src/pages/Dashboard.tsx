import { useState, useEffect } from "react";
import type { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  User,
  Code,
  PlusCircle,
  Users,
  Clock,
  Star,
  FileText,
  Play,
  Globe,
  Folder,
  Activity,
  Archive,
} from "lucide-react";
import CreateRoomModal from "../components/CreateRoomModal";
import { useRoom, type Room } from "../context/RoomContext";
import { useAuth } from "@/context/AuthContext";

const Dashboard: FC = () => {
  const [openRoomModal, setOpenRoomModal] = useState<boolean>(false);
  const [recentRooms, setRecentRooms] = useState<Room[]>([]);
  const [activeRooms] = useState<Room[]>([]);
  const [endedRooms] = useState<Room[]>([]);
  const { getRooms } = useRoom();
  const { user } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Define animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (getRooms) {
        try {
          const recent = await getRooms()

          if (recent) setRecentRooms(recent.slice(0, 4));

          console.log("Rooms fetched:", recent);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      }
    }

    fetchRooms();
  }, [getRooms]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={openRoomModal}
        onClose={() => setOpenRoomModal(false)}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Header */}
      <motion.header
        className="relative z-10 p-6 border-b border-gray-700/50 backdrop-blur-xl flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Code className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            CodeSpace
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Online</span>
          </div>
          <Button
            variant="outline"
            className="border-gray-600 hover:border-gray-400"
          >
            Profile
          </Button>
        </div>
      </motion.header>

      {/* Main Dashboard */}
      <motion.main
        className="relative z-10 flex-1 p-6 grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome + Quick Actions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateY: 2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-2 row-span-1 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex flex-col items-center md:items-start relative z-10">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
                <p className="text-gray-400 text-lg">{user?.username || "Developer"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-400">
                    Active Developer
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
                <Button
                  className="flex items-center gap-3 justify-center group"
                  onClick={() => setOpenRoomModal(true)}
                >
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Room
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-3 justify-center"
                >
                  <Users className="w-5 h-5" />
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-1 row-span-2 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 flex flex-col h-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Active</h2>
                </div>

                <div className="flex-1 space-y-4">
                  {activeRooms.length > 0 ? (
                    activeRooms.slice(0, 2).map((room) => (
                      <div key={room.id} className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-400">
                            {room.Name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-400">Active</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Room ID: {room.RoomID.slice(0, 8)}...
                        </p>
                        <Button size="sm" className="w-full">
                          Join Room
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50 text-center">
                      <div className="text-gray-400 text-sm">No active rooms</div>
                      <div className="text-gray-500 text-xs mt-1">Create a room </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateY: 2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-1 row-span-1 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">Projects</h2>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text mb-1">
                  12
                </p>
                <p className="text-gray-400 text-sm">Total Created</p>

                <div className="flex items-center justify-center gap-1 mt-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-500">Last: 2h ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Rooms */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-4 row-span-1 group relative overflow-hidden"
        >
          {recentRooms.length === 0 || !recentRooms ? (
            <Card>
              <CardContent className="p-8 h-full relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="text-gray-500 italic relative z-10">No recent rooms found.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 h-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Recent Rooms</h2>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    {recentRooms.map((room, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.03, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="group/room"
                      >
                        <Card>
                          <CardContent className="p-6 flex flex-col h-full relative">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            </div>

                            <div className="mb-4">
                              <h3 className="text-lg font-bold mb-2 group-hover/room:text-blue-400 transition-colors">
                                {room.Name}
                              </h3>
                              <div className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400">
                                Coding Room
                              </div>
                            </div>

                            <div className="space-y-3 mb-4 flex-1">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                  Room #{room.RoomID.slice(0, 8)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                  Created by {room.CreatedBy || 'Unknown'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                  {new Date(room.CreatedAt.toString()).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <Button className="w-full group-hover/room:shadow-lg transition-shadow">
                              Enter Room
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Ended Rooms */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateY: -2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-1 row-span-1 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Archive className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">Ended</h2>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text mb-1">
                  {endedRooms.length}
                </p>
                <p className="text-gray-400 text-sm">Completed Sessions</p>

                <div className="flex items-center justify-center gap-1 mt-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">All time</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Statistics */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-2 row-span-1 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Room Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">Total Rooms</h4>
                      <span className="text-lg font-bold text-violet-400">
                        {recentRooms.length + activeRooms.length + endedRooms.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">All time created</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">Active Now</h4>
                      <span className="text-lg font-bold text-green-400">
                        {activeRooms.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Currently running</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">Completed</h4>
                      <span className="text-lg font-bold text-blue-400">
                        {endedRooms.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Successfully ended</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">Recent</h4>
                      <span className="text-lg font-bold text-orange-400">
                        {recentRooms.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Last 4 created</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02, rotateY: 2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:col-span-1 row-span-1 group relative overflow-hidden"
        >
          <Card>
            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">Quick Start</h2>
                <p className="text-gray-400 text-sm mb-4">Get coding instantly</p>

                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setOpenRoomModal(true)}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Room
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Dashboard;

// Dashboard v1.0 â€“ responsive bento-grid layout with sidebar navigation
// Built by spooodieman Â· Oct 2026