import React, { useEffect, useRef, useState } from "react";

export default function VoiceCircle() {
  const [volume, setVolume] = useState(0); // 0 to 1
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const updateVolume = () => {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          let values = 0;
          for (let i = 0; i < bufferLength; i++) {
            values += dataArrayRef.current[i];
          }
          const avg = values / bufferLength;
          setVolume(avg / 100); // Normalize to 0–1
          requestAnimationFrame(updateVolume);
        };

        updateVolume();
      } catch (err) {
        console.error("Mic access denied:", err);
      }
    }

    initMic();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Map volume to scale: between 1x and 2x
  const scale = 1 + Math.min(volume, 1);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div
        className="rounded-full bg-indigo-500 transition-transform duration-100 ease-out"
        style={{
          width: "100px",
          height: "100px",
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
