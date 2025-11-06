import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const CallModal = ({ isOpen, onClose, sessionId, onEndCall }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null); // keep peer ref across renders
  const callRef = useRef(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize Peer only when modal opens
    if (!isOpen) return;

    const id = uuidv4();
    const newPeer = new Peer(id, { debug: 1 });
    peerRef.current = newPeer;
    setPeerId(id);

    const handleIncomingCall = async (incomingCall) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
          localVideo.current.muted = true;
          await localVideo.current.play().catch(() => {});
        }
        incomingCall.answer(stream);
        callRef.current = incomingCall;
        incomingCall.on("stream", (remoteStream) => {
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = remoteStream;
            remoteVideo.current.play().catch(() => {});
          }
        });
        setConnected(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        alert("Could not access camera/microphone. Check permissions.");
      }
    };

    newPeer.on("open", () => {
      // console.log("Peer open:", id);
    });
    newPeer.on("call", handleIncomingCall);
    newPeer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    // cleanup when modal closes or component unmounts
    return () => {
      // close any active call
      try {
        if (callRef.current) callRef.current.close();
      } catch {}
      // destroy peer
      try {
        if (peerRef.current && !peerRef.current.destroyed) {
          peerRef.current.destroy();
        }
      } catch {}
      peerRef.current = null;
      callRef.current = null;
      setConnected(false);
      setRemotePeerId("");
      setPeerId("");
    };
  }, [isOpen]);

  const startCall = async () => {
    if (!remotePeerId.trim()) {
      alert("Enter partner Peer ID to connect!");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
        localVideo.current.muted = true;
        await localVideo.current.play().catch(() => {});
      }

      const outgoingCall = peerRef.current.call(remotePeerId.trim(), stream);
      callRef.current = outgoingCall;

      outgoingCall.on("stream", (remoteStream) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream;
          remoteVideo.current.play().catch(() => {});
        }
      });

      outgoingCall.on("close", () => {
        setConnected(false);
      });

      setConnected(true);
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Failed to start call. Check camera/microphone permissions.");
    }
  };

  const endCall = () => {
    try {
      if (callRef.current) callRef.current.close();
    } catch {}
    try {
      if (peerRef.current && !peerRef.current.destroyed) {
        peerRef.current.destroy();
      }
    } catch {}
    callRef.current = null;
    peerRef.current = null;
    setConnected(false);

    // notify parent that call ended (parent will handle XP & marking complete)
    if (onEndCall) {
      onEndCall();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#11101a] text-white p-6 rounded-2xl shadow-xl w-[92%] md:w-[640px]">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-300">Live Session</h2>
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            End Session
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-300 mb-1">You</div>
            <video
              ref={localVideo}
              className="rounded-lg bg-black w-48 h-36 object-cover"
              playsInline
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-300 mb-1">Remote</div>
            <video
              ref={remoteVideo}
              className="rounded-lg bg-black w-48 h-36 object-cover"
              playsInline
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-gray-300">Your Peer ID:</p>
            <p className="font-mono text-green-400 break-all">{peerId}</p>
          </div>

          {!connected && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter partner Peer ID"
                className="bg-[#0c0c10] text-white px-3 py-2 rounded w-full border border-[#23212a]"
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
        </div>
      </div>
    </div>
  );
};

export default CallModal;
