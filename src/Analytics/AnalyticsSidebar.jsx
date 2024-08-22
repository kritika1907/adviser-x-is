import React, { Fragment, forwardRef } from "react";
import { HomeIcon, CreditCardIcon, UserIcon, ChevronDownIcon, PencilIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Link, NavLink } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import logo from '../assets/logo.png'

const AnalyticsSidebar = forwardRef(({ showSideBar }, ref) => {
  return (
    <div ref={ref} className="fixed w-64 h-full bg-white shadow-sm">
      <div className="flex justify-center items-center mt-[60px] mb-14  ml-[20px]">
        <Link to='/' className="cursor-pointer">
          <img className="object-cover h-16" src={logo} alt="" />
        </Link>
      </div>

      <div className="flex flex-col items-center mt-[100px]">
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            ` ${isActive
              ? "underline"
              : " hover:underline"
            }`
          }
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex flex-row items-center transition-colors text-xl `}
          >

            <div>
              <p>Dashboard</p>
            </div>


          </div>
        </NavLink>
      </div>
    </div>
  );
});

export default AnalyticsSidebar;
