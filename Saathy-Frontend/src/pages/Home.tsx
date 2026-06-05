import { FunctionComponent } from "react";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Pricing from "../components/sections/Pricing";
import FAQ from "../components/sections/FAQ";
import Testimonials from "../components/sections/Testimonials";
import Team from "../components/sections/Team";
import FinalCTA from "../components/sections/FinalCTA";
import Safety from "../components/sections/Safety";
import Stories from "../components/sections/Stories";
import Questions from "../components/sections/Questions";
import Footer from "../components/sections/Footer";
import styles from "./Home.module.css";

const Home: FunctionComponent = () => {
  return (
    <div className={styles.frameParent}>
      <Features />
      <HowItWorks />
      <section className={styles.rdSectionWrapper}>
        <img
          className={styles.rdSectionIcon}
          loading="lazy"
          alt=""
          src="/3rd-Section@2x.png"
        />
      </section>
      <Pricing />
      <FAQ />
      <Testimonials />
      <Team />
      <FinalCTA />
      <Safety />
      <Stories />
      <Questions />
      <Footer />
    </div>
  );
};

export default Home;
