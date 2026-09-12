import React from 'react';

interface ClientInfo {
  user: string;
  userId: string;
  joinedAt: string;
  isOnline: boolean;
}

interface ClientCounterProps {
  clientCount: number;
  clients: ClientInfo[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const ClientCounter: React.FC<ClientCounterProps> = ({
  clientCount,
  clients,
  connectionStatus
}) => {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white text-lg font-semibold">
          Room Status
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-gray-300">{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Online Users:</span>
          <span className="text-white font-medium">{clientCount}</span>
        </div>

        {clients.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm text-gray-400 mb-2">Connected Users:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {clients.map((client, index) => (
                <div
                  key={client.userId || index}
                  className="flex items-center justify-between text-sm p-2 bg-gray-700 rounded"
                >
                  <span className="text-gray-300">{client.user}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {clients.length === 0 && connectionStatus === 'connected' && (
          <div className="text-gray-400 text-sm text-center py-2">
            You're the only one here
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCounter;