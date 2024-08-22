import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Sample data
const data = [
  { srNo: 1, adviserName: 'John Doe', email: 'john.doe@example.com', phoneNo: '+1234567890', title: 'Financial Advisor' },
  { srNo: 2, adviserName: 'Jane Smith', email: 'jane.smith@example.com', phoneNo: '+0987654321', title: 'Career Coach' },
  // Add more data as needed
];

const CreatorsData = () => {

  const location = useLocation()

  const [creatorsData, setCreatorsData] = useState([])

  const { creatorsdata } = location.state || {}

  console.log("creatorsData", creatorsdata)
  // setCreatorsData(creatorsData)

  useEffect(() => {
    setCreatorsData(creatorsdata)
  }, [creatorsdata])


  return (
    <div className='min-h-screen   py-[20px] px-[20px] bg-white pt-[100px] font-Poppins '>
      <p className='text-xl md:text-2xl lg:text-3xl  font-bold mb-4'>Creators</p>
      <div className=" p-4">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adviser Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional Title</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creatorsData.length > 0 ? creatorsData.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.username ? item?.data?.username :'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.email ? item?.data?.email : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.mobile_number ? item?.data?.mobile_number : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item?.data?.professional_title ? item?.data?.professional_title : 'N/A'}</td>
              </tr>
            )) :
            <tr >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900  text-center" colSpan={5}>No data Available!!</td>

          </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreatorsData;
