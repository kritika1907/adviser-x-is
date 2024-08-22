import React, { Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { Transition } from "@headlessui/react";
import AnalyticsHeader from "./Analytics/AnalyticsHeader";
import AnalyticsSidebar from "./Analytics/AnalyticsSidebar";

function AnalyticsLayout() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    if (innerWidth <= 640) {
      setShowSideBar(false);
      setIsMobile(true);
    } else {
      setShowSideBar(true);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window != undefined) {
      addEventListener("resize", handleResize);
    }

    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-row  bg-neutral-100 overflow-hidden overflow-x-auto ">
      <Transition
        as={Fragment}
        show={showSideBar}
        enter="transform transition duration-[400ms]"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform duration-[400ms] transition ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <AnalyticsSidebar showSideBar={showSideBar} />
      </Transition>

      <div className="flex-1">
        <AnalyticsHeader setShowSideBar={setShowSideBar} showSideBar={showSideBar} />
        <div
          className={` transition-all duration-[400ms] ${
            showSideBar && !isMobile ? "pl-64" : ""
          } overflow-x-auto`}
        >
          <Outlet className="px-4 md:px-16" />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsLayout;
