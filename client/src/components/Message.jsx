import React from 'react';

const Message = ({ username, message, isMine }) => {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div 
        className={`
          max-w-[70%] md:max-w-[50%] 
          ${isMine 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-800 border border-gray-200'
          } 
          rounded-2xl px-4 py-3 shadow-sm
          ${isMine 
            ? 'rounded-br-sm' 
            : 'rounded-bl-sm'
          }
        `}
      >
        {!isMine && (
          <div className="text-sm text-gray-500 mb-1 font-medium">{username}</div>
        )}
        <p className="text-base break-words leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default Message;