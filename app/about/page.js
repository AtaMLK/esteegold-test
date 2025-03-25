import "./about.css";

export const metadata = {
  title: "about",
};

function About() {
  return (
    <div>
      <div className="about-container">
        <div className="about-image-container">
          <img
            src="/images/about.JPG"
            alt="estee-image"
            className="about-image"
          />
        </div>
        <div className="about-content ">
          <h2 className="text-3xl text-center font-bold mb-10 text-gray-900">
            Estee Gold Studio
          </h2>
          <p className="text-gray-900 text-xl font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            condimentum turpis in eros facilisis, nec consequat tortor ultrices.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            condimentum turpis in eros facilisis, nec consequat tortor ultrices.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
