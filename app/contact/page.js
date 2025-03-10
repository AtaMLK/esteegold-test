"use client";

import dynamic from "next/dynamic";

function Contact() {
  const DynamicMap = dynamic(() => import("../_components/ui/map"), {
    ssr: false,
  });

  return (
    <div className="w-full h-dvh">
      <div className=" contact-section grid grid-cols-2">
        <div className="contact-form col-start-1 col-span-6">
          <h1> Contact Us</h1>
        </div>
        <div className="address-map col-start-2 col-span-4 p-20">
          <DynamicMap lat={41.102856} lng={28.984782} zoom={15} />
        </div>
      </div>
    </div>
  );
}

export default Contact;
