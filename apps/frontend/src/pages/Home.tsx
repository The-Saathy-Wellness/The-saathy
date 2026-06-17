import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/sections/Hero/Hero';
import CarryingToday from '../components/sections/CarryingToday/CarryingToday';
import StartComfortable from '../components/sections/StartComfortable/StartComfortable';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <CarryingToday />
        <StartComfortable />
      </main>
    </div>
  );
}