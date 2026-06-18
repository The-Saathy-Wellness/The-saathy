import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/sections/Hero/Hero';
import CarryingToday from '../components/sections/CarryingToday/CarryingToday';
import StartWhereYouAreComfortable from '../components/sections/StartComfortable/StartWhereYouAreComfortable';
import BentoGrid from '../components/sections/ConditionsGrid/Bentogrid';
import HumanSupportCTA from "../components/sections/HumanSupportCTA/HumanSupportCTA";
import PrivateSpace from "../components/sections/PrivateSpace/PrivateSpace";
import Footer from "../components/sections/Footer/Footer";





export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <CarryingToday />
        <StartWhereYouAreComfortable />
        <BentoGrid />
        <HumanSupportCTA />
        <PrivateSpace/>
        <Footer/>
      </main>
    </div>
  );
}