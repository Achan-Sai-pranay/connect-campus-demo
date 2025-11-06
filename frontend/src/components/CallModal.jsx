import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const CallModal = ({ isOpen, onClose, sessionId, onEndCall }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const id = uuidv4();
    const newPeer = new Peer(id, { debug: 2 });
    setPeer(newPeer);
    setPeerId(id);

    newPeer.on("open", () => console.log("My peer ID:", id));

    newPeer.on("call", async (incomingCall) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.current.srcObject = stream;
      localVideo.current.play();
      incomingCall.answer(stream);
      incomingCall.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
        remoteVideo.current.play();
      });
      setCall(incomingCall);
      setConnected(true);
    });

    return () => newPeer.destroy();
  }, [isOpen]);

  const startCall = async () => {
    if (!remotePeerId.trim()) {
      alert("Enter Remote Peer ID to connect!");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.current.srcObject = stream;
    localVideo.current.play();

    const outgoingCall = peer.call(remotePeerId, stream);
    outgoingCall.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
      remoteVideo.current.play();
    });
    setCall(outgoingCall);
    setConnected(true);
  };

  const endCall = () => {
    if (call) call.close();
    if (peer) peer.destroy();
    setConnected(false);
    onEndCall(); // triggers XP update
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#1c1b29] text-white p-6 rounded-2xl shadow-xl w-[90%] md:w-[600px]">
        <h2 className="text-xl font-semibold text-purple-400 mb-2">Live Session</h2>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
          <video ref={localVideo} className="rounded-xl w-48 h-36 bg-black" muted />
          <video ref={remoteVideo} className="rounded-xl w-48 h-36 bg-black" />
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <p>Your Peer ID:</p>
            <p className="font-mono text-green-400">{peerId}</p>
          </div>

          {!connected && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter partner Peer ID"
                className="bg-gray-800 text-white px-3 py-1 rounded w-full"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
              />
              <button
                onClick={startCall}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Join Session
              </button>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mt-3"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
