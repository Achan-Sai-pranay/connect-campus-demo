import React, { useState } from "react";
import CallModal from "./CallModal";
import "../styles/SkillCard.css"; // keep your existing CSS if you have one

const SkillCard = ({
  skill,
  onAccept,
  onComplete,
  currentUser,
  onXpUpdate,
}) => {
  const [isCallOpen, setIsCallOpen] = useState(false);

  // Handle call end
  const handleEndCall = () => {
    // XP logic (frontend only)
    if (skill.acceptedBy === currentUser) {
      onXpUpdate(currentUser, 100); // helper gets +100 XP
    } else if (skill.postedBy === currentUser) {
      onXpUpdate(currentUser, 33); // requester gets +33 XP
    }
    onComplete(skill.id); // mark session completed
    setIsCallOpen(false);
  };

  return (
    <div className="bg-[#1c1b29] text-white rounded-2xl p-4 shadow-lg hover:shadow-purple-700/30 transition-all w-full md:w-[340px]">
      <h3 className="text-lg font-semibold text-purple-400">{skill.title}</h3>
      <p className="text-sm text-gray-300 mt-1">{skill.description}</p>

      <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
        <span>Posted by: <span className="text-purple-300">{skill.postedBy}</span></span>
        <span>Status: <span className="text-blue-400">{skill.status}</span></span>
      </div>

      {skill.status === "open" && skill.postedBy !== currentUser && (
        <button
          onClick={() => onAccept(skill.id, currentUser)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 mt-4 rounded-lg w-full transition-all"
        >
          Accept Request
        </button>
      )}

      {skill.status === "accepted" &&
        (skill.acceptedBy === currentUser || skill.postedBy === currentUser) && (
          <button
            onClick={() => setIsCallOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-4 rounded-lg w-full transition-all"
          >
            Join Session
          </button>
        )}

      {skill.status === "completed" && (
        <p className="text-green-400 text-center mt-3 font-semibold">
          ✅ Session Completed
        </p>
      )}

      {/* Call Modal */}
      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        sessionId={skill.id}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

export default SkillCard;
