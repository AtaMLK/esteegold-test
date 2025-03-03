import Link from "next/link";

function About() {
  return (
    <div className=" p-10 mx-10 mt-10 border-gray-500 border-[1px] rounded-sm">
      <div className="flex relative items-center justify-center">
        <img
          src="/images/Fullscreen.jpg"
          className="w-80 object-cover rounded-sm opacity-70 shadow-lg shadow-gray-700"
          loading="lazy"
          alt="about"
        />
        <Link
          href="/about"
          className="absolute items-center justify-center font-dreamFont uppercase text-3xl text-gray-900 z-10 cursor-pointer"
        >
          <span href="/about/page.js">Our Story</span>
        </Link>
        <span className=" absolute w-full z-10 bg-gray-900 opacity-100"></span>
      </div>
      <p className="text-xs mt-5 p-5 text-justify border-[1px] rounded-md">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        doloribus laudantium et ad quasi amet culpa earum quia dolores nostrum
        maxime explicabo ratione, quos assumenda cumque ea reprehenderit
        asperiores necessitatibus. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Accusantium doloribus laudantium et ad quasi amet
        culpa earum quia dolores nostrum maxime explicabo ratione, quos
        assumenda cumque ea reprehenderit asperiores necessitatibus?
      </p>
    </div>
  );
}

export default About;
