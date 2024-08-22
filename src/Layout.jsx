import React, { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Advisor-Components/Header";
import { Transition } from "@headlessui/react";
import SideBar from "./Advisor-Components/SideBar";
import AvailabilitySchedule from "./Advisor-Components/AvailabilitySchedule";
import StateContext from "./Context/StateContext";
import UserFooter from "./User-Components/UserFooter";
import AdviserFooter from "./Advisor-Components/AdviserFooter";
import ProfileShareDialog from "./Advisor-Components/ProfileShareDialog";

function Layout() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateHeader, setUpdateHeader] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareURL, setShareURL] = useState('')

  function handleResize() {
    if (innerWidth <= 640) {
      setShowSideBar(false);
      setIsMobile(true);
    } else {
      setShowSideBar(true);
      setIsMobile(false);
    }
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    
  };


  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleShareDialogOpen = () =>{
    setShareDialogOpen(true);
  }


  useEffect(() => {
    if (typeof window != undefined) {
      addEventListener("resize", handleResize);
    }

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(()=>{
    handleResize()
  },[])

  return (
    <StateContext.Provider value={{handleDialogOpen, updateHeader, setUpdateHeader, handleShareDialogOpen , setShareURL}}>
    <div className="flex flex-row overflow-hidden ">
      {/* <Transition
        as={Fragment}
        show={showSideBar}
        enter="transform transition duration-[400ms]"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform duration-[400ms] transition ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <SideBar showSideBar={showSideBar} handleOpen={handleDialogOpen} setShowSideBar={setShowSideBar}/>
      </Transition> */}

      <div className="flex-1">
        <div className="">
        <Header  setShowSideBar={setShowSideBar} showSideBar={showSideBar} handleOpen={handleDialogOpen} />
        </div>
        <div
          className={`pt-20 lg:pt-[50px]  transition-all duration-[400ms] ${
            showSideBar && !isMobile ? "pl-[50px] " : ""
          } overflow-x-auto`}
        >
          <Outlet className="px-4 md:px-16" />
          <AvailabilitySchedule open={dialogOpen} handleClose={handleDialogClose} />
          <ProfileShareDialog  
                               open={shareDialogOpen}
                               handleClose={handleShareDialogClose}
                               url={shareURL}
          />
        </div>
      </div>

      <div>
        <AdviserFooter />
      </div>
    </div>
    </StateContext.Provider>
  );
}

export default Layout;
