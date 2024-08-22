import React, { useRef, useState } from 'react';
// import { FaPlay, FaPause } from 'react-icons/fa'; // Font Awesome icons

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';

const VideoCard = ({ src, postid, setLoading, description }) => {

    const database = getDatabase(app);
    const auth = getAuth();
    const adviserid = JSON.parse(localStorage.getItem('adviserid'));

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showIcon, setShowIcon] = useState(false);


    const deletePost = async (postid) => {
        setLoading(true)
        remove(ref(database, 'advisers_posts/' + postid));

        const adviserRef = ref(database, 'advisers/' + adviserid);
        const snapshot = await get(adviserRef);
        if (snapshot.exists()) {
            const adviserData = snapshot.val();
            const currentPosts = adviserData.posts || [];


            const updatedPosts = currentPosts.filter(id => id !== postid);



            await update(adviserRef, {
                posts: updatedPosts,
            });
        }

        setLoading(false)
    }

    const deleteHandler = async (postid) => {

        if (!postid) {
            Swal.fire({
                title: "Error",
                text: "Something Went Wrong!!",
                icon: "error",
            });
        }

        Swal.fire({
            title: "Do you want to delete this post?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {
                deletePost(postid)
            }
        });


    }

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

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
                className="absolute top-4 right-4 text-white text-xl   md:text-2xl   lg:text-3xl cursor-pointer z-30"
                onClick={() => deleteHandler(postid)}
            >
                <DeleteIcon fontSize='inherit' />
            </div>

            <div
                className="absolute bottom-8 right-4 text-white text-xl   md:text-2xl   lg:text-3xl cursor-pointer z-30"
                onClick={handleMuteClick}
            >
                {isMuted ? <VolumeOffIcon fontSize='inherit' /> : <VolumeUpIcon fontSize='inherit' />}
            </div>

            {
                description && <div
                    className={`absolute bottom-4 text-white px-2  cursor-pointer  ${isDescriptionExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}
                    onClick={toggleDescription}
                >
                    {description}
                </div>
            }



        </div>
    );
};

export default VideoCard;