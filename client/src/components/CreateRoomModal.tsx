import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/Card";
import Button from "./ui/Button";
import { X, Users, Lock, Globe, Code } from "lucide-react";
import { useNavigate } from "react-router";
import { fetchData } from "../services/backendApi";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      return; // Don't submit if room name is empty
    }

    setIsSubmitting(true);

    try {
      const response = await fetchData.post(`/rooms`, {
        name: roomName,
      });

      if (response.status === 200) {
        const roomLink = response.data.link;
        console.log("Room created with ID:", roomLink);
        onClose();
        navigate(`${roomLink}`);
      }
    } catch (err: unknown) {
      console.log(
        "Failed to create room:",
        err instanceof Error ? err.message : String(err)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="w-full max-w-md"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Create Room
                    </h2>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateRoom} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Enter room name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Room Privacy
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsPrivate(false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border ${!isPrivate
                          ? "bg-blue-600/20 border-blue-600 text-blue-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-400"
                          } transition-colors`}
                      >
                        <Globe className="w-4 h-4" />
                        <span>Public</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPrivate(true)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border ${isPrivate
                          ? "bg-purple-600/20 border-purple-600 text-purple-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-400"
                          } transition-colors`}
                      >
                        <Lock className="w-4 h-4" />
                        <span>Private</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {isPrivate
                        ? "Only people with the link can join"
                        : "Anyone with the link can join"}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2"
                      disabled={isSubmitting || !roomName.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Create Room</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateRoomModal;
