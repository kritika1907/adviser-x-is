import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import { getAuth } from 'firebase/auth';



const PostsData = () => {

    const location = useLocation()

    const database = getDatabase(app);
    const auth = getAuth();

    const [postsData, setPostsData] = useState([])

    const { postsdata } = location.state || {}

    console.log("postsdata", postsdata)

    async function getAdviser(adviserId) {
        const nodeRef = ref(database, `advisers/${adviserId}`);
        try {
            const snapshot = await get(nodeRef);
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log('No data available for adviser:', adviserId);
                return null;
            }
        } catch (error) {
            console.error('Error fetching adviser details:', error);
            return null;
        }
    }

    function getTimePart(dateString) {

        const date = new Date(dateString)

        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Determine AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
        const timeString = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;

        return timeString; // Format: HH:MM:SS AM/PM
    }

    function getDatePart(dateString) {
        const date = new Date(dateString)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`; // Format: YYYY-MM-DD
    }


    useEffect(() => {
        async function fetchAdviserAndServiceDetails() {
            const details = await Promise.all(
                postsdata.map(async (post) => {
                    const adviser = await getAdviser(post.data.adviserid);
                    //   let firstService = null;
                    //   if (adviser && adviser.data?.services && adviser.data.services.length > 0) {
                    //     firstService = await fetchServiceById(adviser.data.services[0]);
                    //   }
                    return { ...post, adviser };
                })
            );



            // Enhanced sort function to handle date and time properly
            details.sort((a, b) => {
                const dateA = new Date(a.data.dop).getTime();
                const dateB = new Date(b.data.dop).getTime();
                return dateB - dateA; // Sort in descending order (latest posts first)
            });


            //   setPostsWithAdviser(details)
            setPostsData(details)
        }

        fetchAdviserAndServiceDetails();
    }, [postsdata]);


    return (
        <div className='min-h-screen py-[20px] px-[20px] bg-white pt-[100px] font-Poppins'>
            <p className='text-xl md:text-2xl lg:text-3xl  font-bold mb-4'>Posts</p>
            <div className="overflow-x-auto p-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator Name</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional Title</th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {postsData.length>0 ? postsData.map((item, idx) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.dop ? getDatePart(item?.data?.dop) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.dop ? getTimePart(item?.data?.dop) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.adviser?.username ? item?.adviser?.username : 'N/A'}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.professional_title}</td> */}
                            </tr>
                        )) :
                        <tr >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900  text-center" colSpan={4}>No data Available!!</td>
            
                      </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostsData;
