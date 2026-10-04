import Hero from '../components/sections/Hero'
import Marquee from '../components/layout/Marquee'
import About from '../components/sections/About'
import Pillars from '../components/sections/Pillars'
import Activities from '../components/sections/Activities'
import Stats from '../components/sections/Stats'
import ImpactMap from '../components/sections/ImpactMap'
import CtaBanner from '../components/sections/CtaBanner'
import Sponsors from '../components/sections/Sponsors'
import InteractiveParticleText from '../components/ui/InteractiveParticleText'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Pillars />
      <Activities />
      <Stats />
      <ImpactMap />
      <InteractiveParticleText />
      <Sponsors />
      <CtaBanner />
      <Contact />
    </main>
  )
}
