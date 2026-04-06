import Hero from '../components/Hero';
import Classes from '../components/Classes';
import Trainers from '../components/Trainers';
import Schedule from '../components/Schedule';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';

const Landing = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Classes />
      <Trainers />
      <Pricing />
      <Schedule />
      <Contact />
    </div>
  );
};

export default Landing;
