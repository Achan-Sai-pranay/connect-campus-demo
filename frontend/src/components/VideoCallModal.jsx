import React, { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import "../styles/VideoCallModal.css";

/**
 * VideoCallModal
 * - skill: object (may have _id or id)
 * - currentUser: string
 * - onClose: () => void
 * - onSessionEnd: ({ xpGain, skillId }) => void  // called after user ends call
 */
const VideoCallModal = ({ skill, currentUser, onClose, onSessionEnd }) => {
  const localRef = useRef(null);
  const remoteRef = useRef(null); // placeholder if you add remote stream later
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [stream, setStream] = useState(null);

  const roomId = skill && (skill._id || skill.id) ? (skill._id || skill.id) : `room-${Date.now()}`;

  useEffect(() => {
    if (!skill) return;

    // connect socket once (do not disconnect global socket here)
    if (!socket.connected) socket.connect();
    socket.emit("join_room", roomId);

    const handleReceive = (data) => setMessages((prev) => [...prev, data]);
    socket.on("receive_message", handleReceive);

    // request media
    let mounted = true;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (!mounted) return;
        setStream(s);
        if (localRef.current) {
          localRef.current.srcObject = s;
          localRef.current.play().catch(() => {});
        }
      })
      .catch((err) => {
        console.warn("Media error:", err);
        // keep modal usable even if no camera accessible
      });

    // cleanup
    return () => {
      mounted = false;
      try {
        socket.emit("leave_room", roomId);
        socket.off("receive_message", handleReceive);
      } catch (e) {}
      // do not disconnect the socket globally
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill && (skill._id || skill.id)]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { room: roomId, sender: currentUser, text: input.trim(), time: new Date().toLocaleTimeString() };
    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const toggleMute = () => {
    if (!stream) return setMuted((m) => !m);
    stream.getAudioTracks().forEach((t) => (t.enabled = muted)); // flip after state change
    setMuted((m) => !m);
  };

  const toggleCamera = () => {
    if (!stream) return setCameraOn((c) => !c);
    stream.getVideoTracks().forEach((t) => (t.enabled = cameraOn));
    setCameraOn((c) => !c);
  };

  const handleEnd = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    // call parent to mark request complete and award XP
    const xpGain = Number(skill.xp || 50);
    onSessionEnd?.({ xpGain, skillId: skill._id || skill.id });
    onClose?.();
  };

  if (!skill) return null;

  return (
    <div className="vc-overlay" role="dialog" aria-modal="true">
      <div className="vc-modal">
        <header className="vc-header">
          <div className="vc-title">📞 {skill.title}</div>
          <button className="vc-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="vc-body">
          <div className="vc-videos">
            <div className="vc-video-box">
              <video ref={localRef} className="vc-video local" muted playsInline />
              <div className="vc-video-label">You</div>
            </div>

            <div className="vc-video-box small">
              {/* placeholder remote area; future remote stream can be attached */}
              <video ref={remoteRef} className="vc-video remote" playsInline />
              <div className="vc-video-label">Peer</div>
            </div>
          </div>

          <aside className="vc-chat">
            <div className="vc-chat-box">
              {messages.length === 0 ? (
                <div className="vc-empty">No chat messages yet</div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`vc-msg ${m.sender === currentUser ? "sent" : "recv"}`}>
                    <div className="vc-msg-text">{m.text}</div>
                    <div className="vc-msg-meta">{m.sender} • {m.time}</div>
                  </div>
                ))
              )}
            </div>

            <div className="vc-chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="vc-send">Send</button>
            </div>
          </aside>
        </div>

        <footer className="vc-footer">
          <div className="vc-controls">
            <button className="vc-icon-btn" onClick={toggleMute} aria-pressed={muted}>
              {muted ? "Unmute" : "Mute"}
            </button>
            <button className="vc-icon-btn" onClick={toggleCamera} aria-pressed={!cameraOn}>
              {cameraOn ? "Camera Off" : "Camera On"}
            </button>
            <button className="vc-end-btn" onClick={handleEnd}>
              End Session
            </button>
          </div>
          <div className="vc-session-info">+{skill.xp || 50} XP on completion</div>
        </footer>
      </div>
    </div>
  );
};

export default VideoCallModal;
