import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/sections/Hero/Hero';
import CarryingToday from '../components/sections/CarryingToday/CarryingToday';
import StartComfortable from '../components/sections/StartComfortable/StartComfortable';
import ConditionsGrid from '../components/sections/ConditionsGrid/ConditionsGrid';
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
        <StartComfortable />
        <ConditionsGrid />
        <HumanSupportCTA />
        <PrivateSpace/>
        <Footer/>
      </main>
    </div>
  );
}