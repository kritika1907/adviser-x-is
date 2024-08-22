import React, { useRef, useState } from 'react';
// import { FaPlay, FaPause } from 'react-icons/fa'; // Font Awesome icons

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const CustomVideoShare = ({ src, description }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 1000); // Hide icon after 1 second
  };

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 1000); // Hide icon after 1 second
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
        onClick={handleVideoClick}
      >
        Your browser does not support the video tag.
      </video>
      {showIcon && (
        <div
          className="absolute inset-0 flex items-center justify-center text-white text-4xl z-20 "
        >
          {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
        </div>
      )}
      
        <div
          className="absolute bottom-4 right-4 text-white text-xl   md:text-2xl   lg:text-3xl cursor-pointer z-30"
          onClick={handleMuteClick}
        >
          {isMuted ? <VolumeOffIcon fontSize='inherit'/> : <VolumeUpIcon fontSize='inherit'/>}
        </div>
      
      {/* <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
        {description}
      </div> */}
    </div>
  );
};

export default CustomVideoShare;