import Hero from './landing/Hero';
import TwoColumnSection from './landing/TwoColumnDescription'

export default function Home() {
  return (
    <div>
      <Hero/>
      <div id="pagething">
        <TwoColumnSection/>
      </div>
    </div>
  );
}
