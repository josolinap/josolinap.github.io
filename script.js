
// Lightning Effects Manager
class LightningManager {
  constructor() {
    this.lightningInterval = 8000; // 8 seconds between lightning
    this.intenseLightningChance = 0.3; // 30% chance of intense lightning
    this.init();
  }

  init() {
    this.startLightning();
  }

  startLightning() {
    // Initial lightning after a random delay
    setTimeout(() => {
      this.createLightning();
      // Start regular lightning cycle
      setInterval(() => {
        this.createLightning();
      }, this.lightningInterval);
    }, Math.random() * 5000 + 2000); // 2-7 seconds initial delay
  }

  createLightning() {
    // Create flash effect
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';

    // Random chance for intense lightning
    if (Math.random() < this.intenseLightningChance) {
      flash.classList.add('intense');
    }

    document.body.appendChild(flash);

    // Remove flash after animation
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 200);

    // Sometimes add a lightning strike
    if (Math.random() < 0.6) { // 60% chance of strike
      setTimeout(() => {
        this.createLightningStrike();
      }, Math.random() * 100); // Slight delay
    }
  }

  createLightningStrike() {
    const strike = document.createElement('div');
    strike.className = 'lightning-strike';

    // Random position for strike
    const position = Math.random() * 100;
    strike.style.left = `${position}%`;

    document.body.appendChild(strike);

    // Remove strike after animation
    setTimeout(() => {
      if (strike.parentNode) {
        strike.parentNode.removeChild(strike);
      }
    }, 300);
  }


}

// Floating Circles Manager
class FloatingCirclesManager {
  constructor() {
    this.circlesContainer = document.querySelector('.floating-circles');
    this.globeContainer = document.querySelector('.globe-container');
    this.circles = [];
    this.maxCircles = 8;
    this.spawnInterval = 3000; // 3 seconds
    this.collisionRadius = 150; // Distance to trigger consumption

    this.init();
  }

  init() {
    this.startSpawning();
    this.startCollisionDetection();
  }

  startSpawning() {
    setInterval(() => {
      if (this.circles.length < this.maxCircles) {
        this.createCircle();
      }
    }, this.spawnInterval);
  }

  createCircle() {
    const circle = document.createElement('div');
    circle.className = 'floating-circle';

    // Random size (20-40px)
    const size = 20 + Math.random() * 20;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    // Random starting position (avoiding center where globe is)
    let x, y, attempts = 0;
    do {
      x = Math.random() * (window.innerWidth - size);
      y = Math.random() * (window.innerHeight - size);
      attempts++;
    } while (this.isNearGlobe(x + size/2, y + size/2) && attempts < 20);

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    // Add to DOM and tracking array
    this.circlesContainer.appendChild(circle);
    this.circles.push({
      element: circle,
      x: x,
      y: y,
      size: size,
      vx: (Math.random() - 0.5) * 2, // Random velocity
      vy: (Math.random() - 0.5) * 2
    });

    // Trigger entrance animation
    setTimeout(() => {
      circle.style.opacity = '1';
      circle.style.transform = 'scale(1)';
    }, 100);
  }

  startCollisionDetection() {
    const checkCollisions = () => {
      const globeRect = this.globeContainer.getBoundingClientRect();
      const globeCenterX = globeRect.left + globeRect.width / 2;
      const globeCenterY = globeRect.top + globeRect.height / 2;

      this.circles.forEach((circle, index) => {
        // Update position
        circle.x += circle.vx;
        circle.y += circle.vy;

        // Bounce off walls
        if (circle.x <= 0 || circle.x >= window.innerWidth - circle.size) {
          circle.vx *= -1;
        }
        if (circle.y <= 0 || circle.y >= window.innerHeight - circle.size) {
          circle.vy *= -1;
        }

        // Apply position
        circle.element.style.left = `${circle.x}px`;
        circle.element.style.top = `${circle.y}px`;

        // Check collision with globe
        const circleCenterX = circle.x + circle.size / 2;
        const circleCenterY = circle.y + circle.size / 2;
        const distance = Math.sqrt(
          Math.pow(circleCenterX - globeCenterX, 2) +
          Math.pow(circleCenterY - globeCenterY, 2)
        );

        if (distance < this.collisionRadius) {
          this.consumeCircle(circle, index);
        }
      });

      requestAnimationFrame(checkCollisions);
    };

    checkCollisions();
  }

  isNearGlobe(x, y) {
    const globeRect = this.globeContainer.getBoundingClientRect();
    const globeCenterX = globeRect.left + globeRect.width / 2;
    const globeCenterY = globeRect.top + globeRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(x - globeCenterX, 2) + Math.pow(y - globeCenterY, 2)
    );
    return distance < 200; // Keep circles away from globe initially
  }

  consumeCircle(circle, index) {
    // Trigger consumption animation
    circle.element.classList.add('consumed');

    // Remove from tracking array and DOM after animation
    setTimeout(() => {
      if (circle.element.parentNode) {
        circle.element.parentNode.removeChild(circle.element);
      }
      this.circles.splice(index, 1);
    }, 500);
  }
}

// Text Generator Manager
class TextGeneratorManager {
  constructor() {
    this.typingText = document.getElementById('typingText');
    this.cursor = document.querySelector('.cursor');
    this.words = [
      "Believe it!",
      "I'm not gonna run away, I never go back on my word!",
      "If you don't like your destiny, don't accept it!",
      "The next generation will always surpass the previous one!",
      "Hard work is worthless for those that don't believe in themselves!",
      "When you give up, your dreams and everything else, they're gone!",
      "I never go back on my word! That's my nindo, my ninja way!",
      "There's no such thing as a natural talent!",
      "I'm going to become Hokage no matter what!",
      "A dropout will beat a genius through hard work!",
      "Those who break the rules are scum, but those who abandon their friends are worse than scum!",
      "If you don't understand the darkness in someone's heart, you can't change them!",
      "The difference between stupidity and genius is that genius has its limits!",
      "I don't know which is Naruto or which is the Nine-Tails!",
      "I'm Uzumaki Naruto! And I'm gonna be Hokage someday!",
      "I won't let you walk away from this!",
      "I never give up! That's my ninja way!",
      "I don't care if I lose! I'm not gonna run away!",
      "I will never give up on my friends!",
      "Power is not everything!",
      "I will become stronger!",
      "I won't let anyone die!",
      "I will protect my friends!",
      "I will never give up!",
      "I will become the strongest ninja!",
      "I will surpass everyone!",
      "I will make my dream come true!",
      "I will never lose to anyone!",
      "I will fight until the end!",
      "I will protect what's important to me!",
      "I will never abandon my friends!",
      "I will become a great ninja!",
      "I will make everyone acknowledge me!",
      "I will never give up on my dream!",
      "I will become Hokage!",
      "I will protect the village!",
      "I will defeat all enemies!",
      "I will save everyone!",
      "I will become a hero!",
      "I will never lose hope!",
      "I will fight for peace!",
      "I will become stronger than anyone!",
      "I will surpass my limits!",
      "I will make my mark on the world!",
      "I will never forget my friends!",
      "I will become the best ninja!",
      "I will protect my loved ones!",
      "I will never give up on justice!",
      "I will fight for what's right!",
      "I will become a legend!",
      "I will make everyone proud!",
      "I will never lose my way!",
      "I will become the ultimate ninja!",
      "I will surpass all expectations!",
      "I will make my dream reality!",
      "I will never abandon hope!",
      "I will fight until victory!",
      "I will protect the future!",
      "I will become unstoppable!",
      "I will make history!",
      "I will never forget my promise!",
      "I will become the greatest!",
      "I will protect my comrades!",
      "I will never give up on love!",
      "I will fight for freedom!",
      "I will become a symbol!",
      "I will make everyone believe!",
      "I will never lose my spirit!",
      "I will fight for tomorrow!",
      "I will protect the present!",
      "I will become legendary!",
      "I will make my impact!",
      "I will never forget my roots!",
      "I will become the ultimate hero!",
      "I will surpass all obstacles!",
      "I will make my dream come true!",
      "I will never abandon my path!",
      "I will fight for eternity!",
      "I will protect all life!",
      "I will become divine!",
      "I will make everyone unite!",
      "I will never lose my flame!",
      "I will fight for all!",
      "I will protect the world!",
      "I will become the savior!",
      "I will make peace eternal!",
      "I will never forget my bonds!",
      "I will become the ultimate warrior!",
      "I will surpass all limits!",
      "I will make my legacy!",
      "I will never give up on humanity!",
      "I will fight for all creation!",
      "I will protect the universe!",
      "I will become the ultimate being!",
      "I will make everyone one!",
      "I will never lose my light!",
      "I will fight for infinity!",
      "I will protect all existence!",
      "I will become the ultimate god!",
      "I will make peace everlasting!",
      "I will never forget my origins!",
      "I will become the ultimate legend!",
      "I will surpass all dimensions!",
      "I will make my dream universal!",
      "I will never abandon my soul!",
      "I will fight for all eternity!",
      "I will protect all realities!",
      "I will become the ultimate force!",
      "I will make unity complete!",
      "I will never lose my essence!",
      "I will fight for all possibilities!",
      "I will protect all potentials!",
      "I will become the ultimate power!",
      "I will make harmony perfect!",
      "I will never forget my core!",
      "I will become the ultimate spirit!",
      "I will surpass all boundaries!",
      "I will make my vision global!",
      "I will never abandon my heart!",
      "I will fight for all hearts!",
      "I will protect all emotions!",
      "I will become the ultimate love!",
      "I will make connection universal!",
      "I will never lose my warmth!",
      "I will fight for all bonds!",
      "I will protect all relationships!",
      "I will become the ultimate friend!",
      "I will make friendship eternal!",
      "I will never forget my companions!",
      "I will become the ultimate ally!",
      "I will surpass all divisions!",
      "I will make unity worldwide!",
      "I will never abandon my team!",
      "I will fight for all teams!",
      "I will protect all groups!",
      "I will become the ultimate leader!",
      "I will make leadership inspiring!",
      "I will never lose my courage!",
      "I will fight for all dreams!",
      "I will protect all hopes!",
      "I will become the ultimate motivator!",
      "I will make motivation universal!",
      "I will never forget my inspiration!",
      "I will become the ultimate example!",
      "I will surpass all doubts!",
      "I will make confidence global!",
      "I will never abandon my belief!",
      "I will fight for all faiths!",
      "I will protect all beliefs!",
      "I will become the ultimate believer!",
      "I will make faith eternal!",
      "I will never lose my conviction!",
      "I will fight for all truths!",
      "I will protect all realities!",
      "I will become the ultimate truth!",
      "I will make honesty universal!",
      "I will never forget my integrity!",
      "I will become the ultimate honest!",
      "I will surpass all lies!",
      "I will make truth worldwide!",
      "I will never abandon my principles!",
      "I will fight for all justices!",
      "I will protect all rights!",
      "I will become the ultimate just!",
      "I will make justice eternal!",
      "I will never lose my honor!",
      "I will fight for all dignities!",
      "I will protect all prides!",
      "I will become the ultimate honorable!",
      "I will make honor universal!",
      "I will never forget my respect!",
      "I will become the ultimate respectful!",
      "I will surpass all rudeness!",
      "I will make respect global!",
      "I will never abandon my courtesy!",
      "I will fight for all kindnesses!",
      "I will protect all compassions!",
      "I will become the ultimate kind!",
      "I will make kindness eternal!",
      "I will never lose my compassion!",
      "I will fight for all mercies!",
      "I will protect all sympathies!",
      "I will become the ultimate merciful!",
      "I will make mercy universal!",
      "I will never forget my empathy!",
      "I will become the ultimate empathetic!",
      "I will surpass all indifference!",
      "I will make empathy worldwide!",
      "I will never abandon my understanding!",
      "I will fight for all wisdoms!",
      "I will protect all knowledges!",
      "I will become the ultimate wise!",
      "I will make wisdom eternal!",
      "I will never lose my intelligence!",
      "I will fight for all learnings!",
      "I will protect all teachings!",
      "I will become the ultimate teacher!",
      "I will make learning universal!",
      "I will never forget my curiosity!",
      "I will become the ultimate learner!",
      "I will surpass all ignorances!",
      "I will make knowledge global!",
      "I will never abandon my wonder!",
      "I will fight for all discoveries!",
      "I will protect all innovations!",
      "I will become the ultimate inventor!",
      "I will make discovery eternal!",
      "I will never lose my creativity!",
      "I will fight for all imaginations!",
      "I will protect all visions!",
      "I will become the ultimate visionary!",
      "I will make vision universal!",
      "I will never forget my imagination!",
      "I will become the ultimate creator!",
      "I will surpass all limitations!",
      "I will make creation global!",
      "I will never abandon my artistry!",
      "I will fight for all beauties!",
      "I will protect all arts!",
      "I will become the ultimate artist!",
      "I will make art eternal!",
      "I will never lose my passion!",
      "I will fight for all expressions!",
      "I will protect all talents!",
      "I will become the ultimate talent!",
      "I will make talent universal!",
      "I will never forget my skill!",
      "I will become the ultimate skilled!",
      "I will surpass all mediocrities!",
      "I will make excellence global!",
      "I will never abandon my mastery!",
      "I will fight for all perfections!",
      "I will protect all excellences!",
      "I will become the ultimate master!",
      "I will make mastery eternal!",
      "I will never lose my dedication!",
      "I will fight for all commitments!",
      "I will protect all devotions!",
      "I will become the ultimate devoted!",
      "I will make dedication universal!",
      "I will never forget my commitment!",
      "I will become the ultimate committed!",
      "I will surpass all hesitations!",
      "I will make commitment global!",
      "I will never abandon my loyalty!",
      "I will fight for all fidelities!",
      "I will protect all trusts!",
      "I will become the ultimate loyal!",
      "I will make loyalty eternal!",
      "I will never lose my trust!",
      "I will fight for all faiths!",
      "I will protect all beliefs!",
      "I will become the ultimate faithful!",
      "I will make faith universal!",
      "I will never forget my devotion!",
      "I will become the ultimate devotee!",
      "I will surpass all doubts!",
      "I will make devotion worldwide!",
      "I will never abandon my worship!",
      "I will fight for all adorations!",
      "I will protect all venerations!",
      "I will become the ultimate worshiper!",
      "I will make worship eternal!",
      "I will never lose my reverence!",
      "I will fight for all respects!",
      "I will protect all honors!",
      "I will become the ultimate reverent!",
      "I will make reverence universal!",
      "I will never forget my admiration!",
      "I will become the ultimate admirer!",
      "I will surpass all disrespects!",
      "I will make admiration global!",
      "I will never abandon my appreciation!",
      "I will fight for all gratitudes!",
      "I will protect all thankfulness!",
      "I will become the ultimate grateful!",
      "I will make gratitude eternal!",
      "I will never lose my thankfulness!",
      "I will fight for all appreciations!",
      "I will protect all recognitions!",
      "I will become the ultimate appreciative!",
      "I will make appreciation universal!",
      "I will never forget my gratitude!",
      "I will become the ultimate thankful!",
      "I will surpass all ingratitudes!",
      "I will make thankfulness worldwide!",
      "I will never abandon my recognition!",
      "I will fight for all acknowledgments!",
      "I will protect all validations!",
      "I will become the ultimate recognizer!",
      "I will make recognition eternal!",
      "I will never lose my validation!",
      "I will fight for all confirmations!",
      "I will protect all affirmations!",
      "I will become the ultimate validator!",
      "I will make validation universal!",
      "I will never forget my affirmation!",
      "I will become the ultimate affirmer!",
      "I will surpass all negations!",
      "I will make affirmation global!",
      "I will never abandon my positivity!",
      "I will fight for all optimisms!",
      "I will protect all hopes!",
      "I will become the ultimate positive!",
      "I will make positivity eternal!",
      "I will never lose my optimism!",
      "I will fight for all encouragements!",
      "I will protect all motivations!",
      "I will become the ultimate encourager!",
      "I will make encouragement universal!",
      "I will never forget my motivation!",
      "I will become the ultimate motivator!",
      "I will surpass all discouragements!",
      "I will make motivation worldwide!",
      "I will never abandon my inspiration!",
      "I will fight for all stimulations!",
      "I will protect all drives!",
      "I will become the ultimate inspirer!",
      "I will make inspiration eternal!",
      "I will never lose my stimulation!",
      "I will fight for all energizings!",
      "I will protect all vitalities!",
      "I will become the ultimate energizer!",
      "I will make energy universal!",
      "I will never forget my vitality!",
      "I will become the ultimate vital!",
      "I will surpass all lethargies!",
      "I will make vitality global!",
      "I will never abandon my life!",
      "I will fight for all existences!",
      "I will protect all beings!",
      "I will become the ultimate alive!",
      "I will make life eternal!",
      "I will never lose my existence!",
      "I will fight for all survivals!",
      "I will protect all persistences!",
      "I will become the ultimate survivor!",
      "I will make survival universal!",
      "I will never forget my persistence!",
      "I will become the ultimate persistent!",
      "I will surpass all givings-up!",
      "I will make persistence worldwide!",
      "I will never abandon my endurance!",
      "I will fight for all resiliences!",
      "I will protect all strengths!",
      "I will become the ultimate resilient!",
      "I will make resilience eternal!",
      "I will never lose my strength!",
      "I will fight for all powers!",
      "I will protect all forces!",
      "I will become the ultimate strong!",
      "I will make strength universal!",
      "I will never forget my power!",
      "I will become the ultimate powerful!",
      "I will surpass all weaknesses!",
      "I will make power global!",
      "I will never abandon my might!",
      "I will fight for all potencies!",
      "I will protect all capabilities!",
      "I will become the ultimate mighty!",
      "I will make might eternal!",
      "I will never lose my capability!",
      "I will fight for all abilities!",
      "I will protect all skills!",
      "I will become the ultimate able!",
      "I will make ability universal!",
      "I will never forget my skill!",
      "I will become the ultimate skilled!",
      "I will surpass all inabilities!",
      "I will make skill worldwide!",
      "I will never abandon my competence!",
      "I will fight for all proficiencies!",
      "I will protect all expertises!",
      "I will become the ultimate competent!",
      "I will make competence eternal!",
      "I will never lose my proficiency!",
      "I will fight for all masteries!",
      "I will protect all supremacies!",
      "I will become the ultimate proficient!",
      "I will make proficiency universal!",
      "I will never forget my expertise!",
      "I will become the ultimate expert!",
      "I will surpass all novices!",
      "I will make expertise global!",
      "I will never abandon my specialization!",
      "I will fight for all focuses!",
      "I will protect all concentrations!",
      "I will become the ultimate specialist!",
      "I will make specialization eternal!",
      "I will never lose my focus!",
      "I will fight for all attentions!",
      "I will protect all concentrations!",
      "I will become the ultimate focused!",
      "I will make focus universal!",
      "I will never forget my attention!",
      "I will become the ultimate attentive!",
      "I will surpass all distractions!",
      "I will make attention worldwide!",
      "I will never abandon my concentration!",
      "I will fight for all intensifications!",
      "I will protect all intensives!",
      "I will become the ultimate concentrated!",
      "I will make concentration eternal!",
      "I will never lose my intensity!",
      "I will fight for all depths!",
      "I will protect all profundities!",
      "I will become the ultimate intense!",
      "I will make intensity universal!",
      "I will never forget my depth!",
      "I will become the ultimate profound!",
      "I will surpass all superficialities!",
      "I will make profundity global!",
      "I will never abandon my seriousness!",
      "I will fight for all gravities!",
      "I will protect all importances!",
      "I will become the ultimate serious!",
      "I will make seriousness eternal!",
      "I will never lose my gravity!",
      "I will fight for all significances!",
      "I will protect all meanings!",
      "I will become the ultimate significant!",
      "I will make significance universal!",
      "I will never forget my meaning!",
      "I will become the ultimate meaningful!",
      "I will surpass all irrelevances!",
      "I will make meaning worldwide!",
      "I will never abandon my purpose!",
      "I will fight for all objectives!",
      "I will protect all goals!",
      "I willI will become the ultimate purposeful!",
      "I will make purpose eternal!",
      "I will never lose my objective!",
      "I will fight for all aims!",
      "I will protect all targets!",
      "I will become the ultimate objective!",
      "I will make objective universal!",
      "I will never forget my aim!",
      "I will become the ultimate aimed!",
      "I will surpass all aimlessnesses!",
      "I will make aim global!",
      "I will never abandon my target!",
      "I will fight for all destinations!",
      "I will protect all ends!",
      "I will become the ultimate targeted!",
      "I will make target eternal!",
      "I will never lose my destination!",
      "I will fight for all journeys!",
      "I will protect all paths!",
      "I will become the ultimate destined!",
      "I will make destination universal!",
      "I will never forget my journey!",
      "I will become the ultimate journeyer!",
      "I will surpass all losts!",
      "I will make journey worldwide!",
      "I will never abandon my path!",
      "I will fight for all ways!",
      "I will protect all roads!",
      "I will become the ultimate wayfarer!",
      "I will make path eternal!",
      "I will never lose my way!",
      "I will fight for all directions!",
      "I will protect all guidances!",
      "I will become the ultimate directed!",
      "I will make direction universal!",
      "I will never forget my guidance!",
      "I will become the ultimate guided!",
      "I will surpass all misdirections!",
      "I will make guidance global!",
      "I will never abandon my leadership!",
      "I will fight for all guidances!",
      "I will protect all directions!",
      "I will become the ultimate leader!",
      "I will make leadership eternal!",
      "I will never lose my guidance!",
      "I will fight for all directions!",
      "I will protect all paths!",
      "I will become the ultimate guider!",
      "I will make guidance universal!",
      "I will never forget my direction!",
      "I will become the ultimate director!",
      "I will surpass all confusions!",
      "I will make direction worldwide!",
      "I will never abandon my clarity!",
      "I will fight for all lucidities!",
      "I will protect all transparencies!",
      "I will become the ultimate clear!",
      "I will make clarity eternal!",
      "I will never lose my lucidity!",
      "I will fight for all understandings!",
      "I will protect all comprehensions!",
      "I will become the ultimate lucid!",
      "I will make lucidity universal!",
      "I will never forget my understanding!",
      "I will become the ultimate comprehender!",
      "I will surpass all misunderstandings!",
      "I will make understanding global!",
      "I will never abandon my comprehension!",
      "I will fight for all grasps!",
      "I will protect all apprehensions!",
      "I will become the ultimate comprehender!",
      "I will make comprehension eternal!",
      "I will never lose my grasp!",
      "I will fight for all holdings!",
      "I will protect all containments!",
      "I will become the ultimate holder!",
      "I will make grasp universal!",
      "I will never forget my holding!",
      "I will become the ultimate container!",
      "I will surpass all releases!",
      "I will make holding worldwide!",
      "I will never abandon my containment!",
      "I will fight for all retentions!",
      "I will protect all keepings!",
      "I will become the ultimate retainer!",
      "I will make retention eternal!",
      "I will never lose my keeping!",
      "I will fight for all maintenances!",
      "I will protect all preservations!",
      "I will become the ultimate maintainer!",
      "I will make maintenance universal!",
      "I will never forget my preservation!",
      "I will become the ultimate preserver!",
      "I will surpass all losses!",
      "I will make preservation global!",
      "I will never abandon my conservation!",
      "I will fight for all safekeepings!",
      "I will protect all safeguards!",
      "I will become the ultimate conserver!",
      "I will make conservation eternal!",
      "I will never lose my safeguard!",
      "I will fight for all protections!",
      "I will protect all securities!",
      "I will become the ultimate protector!",
      "I will make protection universal!",
      "I will never forget my security!",
      "I will become the ultimate securer!",
      "I will surpass all dangers!",
      "I will make security worldwide!",
      "I will never abandon my safety!",
      "I will fight for all securities!",
      "I will protect all safeties!",
      "I will become the ultimate safer!",
      "I will make safety eternal!",
      "I will never lose my security!",
      "I will fight for all assurances!",
      "I will protect all certainties!",
      "I will become the ultimate assurer!",
      "I will make assurance universal!",
      "I will never forget my certainty!",
      "I will become the ultimate certain!",
      "I will surpass all uncertainties!",
      "I will make certainty global!",
      "I will never abandon my confidence!",
      "I will fight for all trusts!",
      "I will protect all reliances!",
      "I will become the ultimate confident!",
      "I will make confidence eternal!",
      "I will never lose my trust!",
      "I will fight for all faiths!",
      "I will protect all beliefs!",
      "I will become the ultimate faithful!",
      "I will make faith universal!",
      "I will never forget my reliance!",
      "I will become the ultimate reliant!",
      "I will surpass all mistrusts!",
      "I will make reliance worldwide!",
      "I will never abandon my dependence!",
      "I will fight for all reliances!",
      "I will protect all dependencies!",
      "I will become the ultimate dependent!",
      "I will make dependence eternal!",
      "I will never lose my reliance!",
      "I will fight for all supports!",
      "I will protect all backings!",
      "I will become the ultimate supporter!",
      "I will make support universal!",
      "I will never forget my backing!",
      "I will become the ultimate backer!",
      "I will surpass all abandonments!",
      "I will make backing global!",
      "I will never abandon my support!",
      "I will fight for all aids!",
      "I will protect all helps!",
      "I will become the ultimate aider!",
      "I will make aid eternal!",
      "I will never lose my help!",
      "I will fight for all assistances!",
      "I will protect all services!",
      "I will become the ultimate assistant!",
      "I will make assistance universal!",
      "I will never forget my service!",
      "I will become the ultimate server!",
      "I will surpass all neglects!",
      "I will make service worldwide!",
      "I will never abandon my assistance!",
      "I will fight for all cooperations!",
      "I will protect all partnerships!",
      "I will become the ultimate cooperator!",
      "I will make cooperation eternal!",
      "I will never lose my partnership!",
      "I will fight for all collaborations!",
      "I will protect all alliances!",
      "I will become the ultimate collaborator!",
      "I will make collaboration universal!",
      "I will never forget my alliance!",
      "I will become the ultimate ally!",
      "I will surpass all isolations!",
      "I will make alliance global!",
      "I will never abandon my collaboration!",
      "I will fight for all synergies!",
      "I will protect all harmonies!",
      "I will become the ultimate synergist!",
      "I will make synergy eternal!",
      "I will never lose my harmony!",
      "I will fight for all balances!",
      "I will protect all equilibria!",
      "I will become the ultimate balancer!",
      "I will make balance universal!",
      "I will never forget my equilibrium!",
      "I will become the ultimate equilibrator!",
      "I will surpass all imbalances!",
      "I will make equilibrium worldwide!",
      "I will never abandon my balance!",
      "I will fight for all stabilities!",
      "I will protect all steadinesses!",
      "I will become the ultimate stabilizer!",
      "I will make stability eternal!",
      "I will never lose my steadiness!",
      "I will fight for all consistencies!",
      "I will protect all reliabilities!",
      "I will become the ultimate consistent!",
      "I will make consistency universal!",
      "I will never forget my reliability!",
      "I will become the ultimate reliable!",
      "I will surpass all inconsistencies!",
      "I will make reliability global!",
      "I will never abandon my consistency!",
      "I will fight for all uniformities!",
      "I will protect all regularities!",
      "I will become the ultimate uniform!",
      "I will make uniformity eternal!",
      "I will never lose my regularity!",
      "I will fight for all standards!",
      "I will protect all norms!",
      "I will become the ultimate standard!",
      "I will make standard universal!",
      "I will never forget my norm!",
      "I will become the ultimate normal!",
      "I will surpass all abnormalities!",
      "I will make norm worldwide!",
      "I will never abandon my standard!",
      "I will fight for all qualities!",
      "I will protect all excellences!",
      "I will become the ultimate quality!",
      "I will make quality eternal!",
      "I will never lose my excellence!",
      "I will fight for all superiorities!",
      "I will protect all supremacies!",
      "I will become the ultimate superior!",
      "I will make superiority universal!",
      "I will never forget my supremacy!",
      "I will become the ultimate supreme!",
      "I will surpass all inferiors!",
      "I will make supremacy global!",
      "I will never abandon my superiority!",
      "I will fight for all excellences!",
      "I will protect all perfections!",
      "I will become the ultimate excellent!",
      "I will make excellence eternal!",
      "I will never lose my perfection!",
      "I will fight for all ideals!",
      "I will protect all paradigms!",
      "I will become the ultimate ideal!",
      "I will make ideal universal!",
      "I will never forget my paradigm!",
      "I will become the ultimate paradigmatic!",
      "I will surpass all imperfections!",
      "I will make paradigm worldwide!",
      "I will never abandon my ideal!",
      "I will fight for all models!",
      "I will protect all examples!",
      "I will become the ultimate model!",
      "I will make model eternal!",
      "I will never lose my example!",
      "I will fight for all prototypes!",
      "I will protect all archetypes!",
      "I will become the ultimate prototype!",
      "I will make prototype universal!",
      "I will never forget my archetype!",
      "I will become the ultimate archetypal!",
      "I will surpass all atypicals!",
      "I will make archetype global!",
      "I will never abandon my prototype!",
      "I will fight for all originals!",
      "I will protect all innovations!",
      "I will become the ultimate original!",
      "I will make original eternal!",
      "I will never lose my innovation!",
      "I will fight for all creations!",
      "I will protect all inventions!",
      "I will become the ultimate creator!",
      "I will make creation universal!",
      "I will never forget my invention!",
      "I will become the ultimate inventor!",
      "I will surpass all copies!",
      "I will make invention worldwide!",
      "I will never abandon my originality!",
      "I will fight for all authenticities!",
      "I will protect all genuineness!",
      "I will become the ultimate authentic!",
      "I will make authenticity eternal!",
      "I will never lose my genuineness!",
      "I will fight for all realnesses!",
      "I will protect all truths!",
      "I will become the ultimate real!",
      "I will make realness universal!",
      "I will never forget my truth!",
      "I will become the ultimate truthful!",
      "I will surpass all fakes!",
      "I will make truth global!",
      "I will never abandon my authenticity!",
      "I will fight for all legitimacies!",
      "I will protect all validities!",
      "I will become the ultimate legitimate!",
      "I will make legitimacy eternal!",
      "I will never lose my validity!",
      "I will fight for all legalities!",
      "I will protect all laws!",
      "I will become the ultimate legal!",
      "I will make legality universal!",
      "I will never forget my law!",
      "I will become the ultimate lawful!",
      "I will surpass all illegalities!",
      "I will make law worldwide!",
      "I will never abandon my legitimacy!",
      "I will fight for all justices!",
      "I will protect all rights!",
      "I will become the ultimate just!",
      "I will make justice eternal!",
      "I will never lose my right!",
      "I will fight for all equities!",
      "I will protect all fairnesses!",
      "I will become the ultimate equitable!",
      "I will make equity universal!",
      "I will never forget my fairness!",
      "I will become the ultimate fair!",
      "I will surpass all unfairnesses!",
      "I will make fairness global!",
      "I will never abandon my equity!",
      "I will fight for all equalities!",
      "I will protect all parities!",
      "I will become the ultimate equal!",
      "I will make equality eternal!",
      "I will never lose my parity!",
      "I will fight for all balances!",
      "I will protect all symmetries!",
      "I will become the ultimate balanced!",
      "I will make balance universal!",
      "I will never forget my symmetry!",
      "I will become the ultimate symmetric!",
      "I will surpass all asymmetries!",
      "I will make symmetry worldwide!",
      "I will never abandon my balance!",
      "I will fight for all harmonies!",
      "I will protect all concordances!",
      "I will become the ultimate harmonious!",
      "I will make harmony eternal!",
      "I will never lose my concordance!",
      "I will fight for all agreements!",
      "I will protect all consensuses!",
      "I will become the ultimate agreeable!",
      "I will make agreement universal!",
      "I will never forget my consensus!",
      "I will become the ultimate consensual!",
      "I will surpass all disagreements!",
      "I will make consensus global!",
      "I will never abandon my agreement!",
      "I will fight for all unities!",
      "I will protect all onenesses!",
      "I will become the ultimate united!",
      "I will make unity eternal!",
      "I will never lose my oneness!",
      "I will fight for all wholes!",
      "I will protect all integrities!",
      "I will become the ultimate whole!",
      "I will make integrity universal!",
      "I will never forget my whole!",
      "I will become the ultimate integral!",
      "I will surpass all divisions!",
      "I will make whole worldwide!",
      "I will never abandon my integrity!",
      "I will fight for all completennesses!",
      "I will protect all totalities!",
      "I will become the ultimate complete!",
      "I will make completeness eternal!",
      "I will never lose my totality!",
      "I will fight for all entireties!",
      "I will protect all wholenesses!",
      "I will become the ultimate entire!",
      "I will make entirety universal!",
      "I will never forget my wholeness!",
      "I will become the ultimate whole!",
      "I will surpass all incompletenesses!",
      "I will make wholeness global!",
      "I will never abandon my completeness!",
      "I will fight for all integrities!",
      "I will protect all unities!",
      "I will become the ultimate integral!",
      "I will make integrity eternal!",
      "I will never lose my unity!",
      "I will fight for all cohesions!",
      "I will protect all adhesions!",
      "I will become the ultimate cohesive!",
      "I will make cohesion universal!",
      "I will never forget my adhesion!",
      "I will become the ultimate adhesive!",
      "I will surpass all separations!",
      "I will make adhesion worldwide!",
      "I will never abandon my cohesion!",
      "I will fight for all bonds!",
      "I will protect all connections!",
      "I will become the ultimate bonded!",
      "I will make bond eternal!",
      "I will never lose my connection!",
      "I will fight for all links!",
      "I will protect all ties!",
      "I will become the ultimate linked!",
      "I will make link universal!",
      "I will never forget my tie!",
      "I will become the ultimate tied!",
      "I will surpass all disconnections!",
      "I will make tie global!",
      "I will never abandon my link!",
      "I will fight for all attachments!",
      "I will protect all fastenings!",
      "I will become the ultimate attached!",
      "I will make attachment eternal!",
      "I will never lose my fastening!",
      "I will fight for all bindings!",
      "I will protect all holdings!",
      "I will become the ultimate bound!",
      "I will make binding universal!",
      "I will never forget my holding!",
      "I will become the ultimate holder!",
      "I will surpass all releases!",
      "I will make holding worldwide!",
      "I will never abandon my binding!",
      "I will fight for all unions!",
      "I will protect all marriages!",
      "I will become the ultimate united!",
      "I will make union eternal!",
      "I will never lose my marriage!",
      "I will fight for all combinations!",
      "I will protect all mergers!",
      "I will become the ultimate combined!",
      "I will make combination universal!",
      "I will never forget my merger!",
      "I will become the ultimate merged!",
      "I will surpass all separations!",
      "I will make merger global!",
      "I will never abandon my combination!",
      "I will fight for all integrations!",
      "I will protect all incorporations!",
      "I will become the ultimate integrated!",
      "I will make integration eternal!",
      "I will never lose my incorporation!",
      "I will fight for all assimilations!",
      "I will protect all absorptions!",
      "I will become the ultimate assimilated!",
      "I will make assimilation universal!",
      "I will never forget my absorption!",
      "I will become the ultimate absorbed!",
      "I will surpass all segregations!",
      "I will make absorption worldwide!",
      "I will never abandon my assimilation!",
      "I will fight for all inclusions!",
      "I will protect all encompassments!",
      "I will become the ultimate included!",
      "I will make inclusion eternal!",
      "I will never lose my encompassment!",
      "I will fight for all containments!",
      "I will protect all holdings!",
      "I will become the ultimate contained!",
      "I will make containment universal!",
      "I will never forget my holding!",
      "I will become the ultimate holder!",
      "I will surpass all exclusions!",
      "I will make holding global!",
      "I will never abandon my inclusion!",
      "I will fight for all acceptances!",
      "I will protect all welcomes!",
      "I will become the ultimate accepted!",
      "I will make acceptance eternal!",
      "I will never lose my welcome!",
      "I will fight for all receptions!",
      "I will protect all greetings!",
      "I will become the ultimate received!",
      "I will make reception universal!",
      "I will never forget my greeting!",
      "I will become the ultimate greeter!",
      "I will surpass all rejections!",
      "I will make greeting worldwide!",
      "I will never abandon my acceptance!",
      "I will fight for all admissions!",
      "I will protect all entries!",
      "I will become the ultimate admitted!",
      "I will make admission eternal!",
      "I will never lose my entry!",
      "I will fight for all accesses!",
      "I will protect all entrances!",
      "I will become the ultimate accessed!",
      "I will make access universal!",
      "I will never forget my entrance!",
      "I will become the ultimate entrer!",
      "I will surpass all denials!",
      "I will make entrance global!",
      "I will never abandon my admission!",
      "I will fight for all permissions!",
      "I will protect all allowances!",
      "I will become the ultimate permitted!",
      "I will make permission eternal!",
      "I will never lose my allowance!",
      "I will fight for all licenses!",
      "I will protect all authorizations!",
      "I will become the ultimate licensed!",
      "I will make license universal!",
      "I will never forget my authorization!",
      "I will become the ultimate authorized!",
      "I will surpass all prohibitions!",
      "I will make authorization worldwide!",
      "I will never abandon my permission!",
      "I will fight for all freedoms!",
      "I will protect all liberties!",
      "I will become the ultimate free!",
      "I will make freedom eternal!",
      "I will never lose my liberty!",
      "I will fight for all autonomies!",
      "I will protect all independences!",
      "I will become the ultimate autonomous!",
      "I will make autonomy universal!",
      "I will never forget my independence!",
      "I will become the ultimate independent!",
      "I will surpass all dependencies!",
      "I will make independence global!",
      "I will never abandon my freedom!",
      "I will fight for all releases!",
      "I will protect all liberations!",
      "I will become the ultimate released!",
      "I will make release eternal!",
      "I will never lose my liberation!",
      "I will fight for all emancipations!",
      "I will protect all frees!",
      "I will become the ultimate emancipated!",
      "I will make emancipation universal!",
      "I will never forget my free!",
      "I will become the ultimate freer!",
      "I will surpass all captivities!",
      "I will make free worldwide!",
      "I will never abandon my liberation!",
      "I will fight for all deliverances!",
      "I will protect all salvations!",
      "I will become the ultimate delivered!",
      "I will make deliverance eternal!",
      "I will never lose my salvation!",
      "I will fight for all rescues!",
      "I will protect all redemptions!",
      "I will become the ultimate rescued!",
      "I will make rescue universal!",
      "I will never forget my redemption!",
      "I will become the ultimate redeemer!",
      "I will surpass all damnations!",
      "I will make redemption global!",
      "I will never abandon my deliverance!",
      "I will fight for all liberations!",
      "I will protect all freedoms!",
      "I will become the ultimate liberator!",
      "I will make liberation eternal!",
      "I will never lose my freedom!",
      "I will fight for all independences!",
      "I will protect all sovereignties!",
      "I will become the ultimate independent!",
      "I will make independence universal!",
      "I will never forget my sovereignty!",
      "I will become the ultimate sovereign!",
      "I will surpass all subjections!",
      "I will make sovereignty worldwide!",
      "I will never abandon my independence!",
      "I will fight for all autonomies!",
      "I will protect all self-governances!",
      "I will become the ultimate autonomous!",
      "I will make autonomy eternal!",
      "I will never lose my self-governance!",
      "I will fight for all self-determinations!",
      "I will protect all self-rules!",
      "I will become the ultimate self-determined!",
      "I will make self-determination universal!",
      "I will never forget my self-rule!",
      "I will become the ultimate self-ruler!",
      "I will surpass all controls!",
      "I will make self-rule global!",
      "I will never abandon my autonomy!",
      "I will fight for all self-sufficiencies!",
      "I will protect all self-reliances!",
      "I will become the ultimate self-sufficient!",
      "I will make self-sufficiency eternal!",
      "I will never lose my self-reliance!",
      "I will fight for all self-supports!",
      "I will protect all self-maintenances!",
      "I will become the ultimate self-supported!",
      "I will make self-support universal!",
      "I will never forget my self-maintenance!",
      "I will become the ultimate self-maintainer!",
      "I will surpass all dependencies!",
      "I will make self-maintenance worldwide!",
      "I will never abandon my self-sufficiency!",
      "I will fight for all self-sustainments!",
      "I will protect all self-preservations!",
      "I will become the ultimate self-sustained!",
      "I will make self-sustenance eternal!",
      "I will never lose my self-preservation!",
      "I will fight for all self-conservations!",
      "I will protect all self-safeguards!",
      "I will become the ultimate self-conserved!",
      "I will make self-conservation universal!",
      "I will never forget my self-safeguard!",
      "I will become the ultimate self-safeguarder!",
      "I will surpass all vulnerabilities!",
      "I will make self-safeguard global!",
      "I will never abandon my self-preservation!",
      "I will fight for all self-defenses!",
      "I will protect all self-protections!",
      "I will become the ultimate self-defended!",
      "I will make self-defense eternal!",
      "I will never lose my capability!",
      "I will fight for all abilities!",
      "I will protect all skills!",
      "I will become the ultimate able!",
      "I will make ability universal!",
      "I will never forget my skill!",
      "I will become the ultimate skilled!",
      "I will surpass all inabilities!",
      "I will make skill worldwide!",
      "I will never abandon my competence!",
      "I will fight for all proficiencies!",
      "I will protect all expertises!",
      "I will become the ultimate competent!",
      "I will make competence eternal!",
      "I will never lose my proficiency!",
      "I will fight for all masteries!",
      "I will protect all supremacies!",
      "I will become the ultimate proficient!",
      "I will make proficiency universal!",
      "I will never forget my expertise!",
      "I will become the ultimate expert!",
      "I will surpass all novices!",
      "I will make expertise global!",
      "I will never abandon my specialization!",
      "I will fight for all focuses!",
      "I will protect all concentrations!",
      "I will become the ultimate specialist!",
      "I will make specialization eternal!",
      "I will never lose my focus!",
      "I will fight for all attentions!",
      "I will protect all concentrations!",
      "I will become the ultimate focused!",
      "I will make focus universal!",
      "I will never forget my attention!",
      "I will become the ultimate attentive!",
      "I will surpass all distractions!",
      "I will make attention worldwide!",
      "I will never abandon my concentration!",
      "I will fight for all intensifications!",
      "I will protect all intensives!",
      "I will become the ultimate concentrated!",
      "I will make concentration eternal!",
      "I will never lose my intensity!",
      "I will fight for all depths!",
      "I will protect all profundities!",
      "I will become the ultimate intense!",
      "I will make intensity universal!",
      "I will never forget my depth!",
      "I will become the ultimate profound!",
      "I will surpass all superficialities!",
      "I will make profundity global!",
      "I will never abandon my seriousness!",
      "I will fight for all gravities!",
      "I will protect all importances!",
      "I will become the ultimate serious!",
      "I will make seriousness eternal!",
      "I will never lose my gravity!",
      "I will fight for all significances!",
      "I will protect all meanings!",
      "I will become the ultimate significant!",
      "I will make significance universal!",
      "I will never forget my meaning!",
      "I will become the ultimate meaningful!",
      "I will surpass all irrelevances!",
      "I will make meaning worldwide!",
      "I will never abandon my purpose!",
      "I will fight for all objectives!",
      "I will protect all goals!",
      "I will become the ultimate purposeful!",
      "I will make purpose eternal!",
      "I will never lose my objective!",
      "I will fight for all aims!",
      "I will protect all targets!",
      "I will become the ultimate objective!",
      "I will make objective universal!",
      "I will never forget my aim!",
      "I will become the ultimate aimed!",
      "I will surpass all aimlessnesses!",
      "I will make aim global!",
      "I will never abandon my target!",
      "I will fight for all destinations!",
      "I will protect all ends!",
      "I will become the ultimate targeted!",
      "I will make target eternal!",
      "I will never lose my destination!",
      "I will fight for all journeys!",
      "I will protect all paths!",
      "I will become the ultimate destined!",
      "I will make destination universal!",
      "I will never forget my journey!",
      "I will become the ultimate journeyer!",
      "I will surpass all losts!",
      "I will make journey worldwide!",
      "I will never abandon my path!",
      "I will fight for all ways!",
      "I will protect all roads!",
      "I will become the ultimate wayfarer!",
      "I will make path eternal!",
      "I will never lose my way!",
      "I will fight for all directions!",
      "I will protect all guidances!",
      "I will become the ultimate directed!",
      "I will make direction universal!",
      "I will never forget my guidance!",
      "I will become the ultimate guided!",
      "I will surpass all misdirections!",
      "I will make guidance global!",
      "I will never abandon my leadership!",
      "I will fight for all guidances!",
      "I will protect all directions!",
      "I will become the ultimate leader!",
      "I will make leadership eternal!",
      "I will never lose my guidance!",
      "I will fight for all directions!",
      "I will protect all paths!",
      "I will become the ultimate guider!",
      "I will make guidance universal!",
      "I will never forget my direction!",
      "I will become the ultimate director!",
      "I will surpass all confusions!",
      "I will make direction worldwide!",
      "I will never abandon my clarity!",
      "I will fight for all lucidities!",
      "I will protect all transparencies!",
      "I will become the ultimate clear!",
      "I will make clarity eternal!",
      "I will never lose my lucidity!",
      "I will fight for all understandings!",
      "I will protect all comprehensions!",
      "I will become the ultimate lucid!",
      "I will make lucidity universal!",
      "I will never forget my understanding!",
      "I will become the ultimate comprehender!",
      "I will surpass all misunderstandings!",
      "I will make understanding global!",
      "I will never abandon my comprehension!",
      "I will fight for all grasps!",
      "I will protect all apprehensions!",
      "I will become the ultimate comprehender!",
      "I will make comprehension eternal!",
      "I will never lose my grasp!",
      "I will fight for all holdings!",
      "I will protect all containments!",
      "I will become the ultimate holder!",
      "I will make grasp universal!",
      "I will never forget my holding!",
      "I will become the ultimate container!",
      "I will surpass all releases!",
      "I will make holding worldwide!",
      "I will never abandon my containment!",
      "I will fight for all retentions!",
      "I will protect all keepings!",
      "I will become the ultimate retainer!",
      "I will make retention eternal!",
      "I will never lose my keeping!",
      "I will fight for all maintenances!",
      "I will protect all preservations!",
      "I will become the ultimate maintainer!",
      "I will make maintenance universal!",
      "I will never forget my preservation!",
      "I will become the ultimate preserver!",
      "I will surpass all losses!",
      "I will make preservation global!",
      "I will never abandon my conservation!",
      "I will fight for all safekeepings!",
      "I will protect all safeguards!",
      "I will become the ultimate conserver!",
      "I will make conservation eternal!",
      "I will never lose my safeguard!",
      "I will fight for all protections!",
      "I will protect all securities!",
      "I will become the ultimate protector!",
      "I will make protection universal!",
      "I will never forget my security!",
      "I will become the ultimate securer!",
      "I will surpass all dangers!",
      "I will make security worldwide!",
      "I will never abandon my safety!",
      "I will fight for all securities!",
      "I will protect all safeties!",
      "I will become the ultimate safer!",
      "I will make safety eternal!",
      "I will never lose my security!",
      "I will fight for all assurances!",
      "I will protect all certainties!",
      "I will become the ultimate assurer!",
      "I will make assurance universal!",
      "I will never forget my certainty!",
      "I will become the ultimate certain!",
      "I will surpass all uncertainties!",
      "I will make certainty global!",
      "I will never abandon my confidence!",
      "I will fight for all trusts!",
      "I will protect all reliances!",
      "I will become the ultimate confident!",
      "I will make confidence eternal!",
      "I will never lose my trust!",
      "I will fight for all faiths!",
      "I will protect all beliefs!",
      "I will become the ultimate faithful!",
      "I will make faith universal!",
      "I will never forget my reliance!",
      "I will become the ultimate reliant!",
      "I will surpass all mistrusts!",
      "I will make reliance worldwide!",
      "I will never abandon my dependence!",
      "I will fight for all reliances!",
      "I will protect all dependencies!",
      "I will become the ultimate dependent!",
      "I will make dependence eternal!",
      "I will never lose my reliance!",
      "I will fight for all supports!",
      "I will protect all backings!",
      "I will become the ultimate supporter!",
      "I will make support universal!",
      "I will never forget my backing!",
      "I will become the ultimate backer!",
      "I will surpass all abandonments!",
      "I will make backing global!",
      "I will never abandon my support!",
      "I will fight for all aids!",
      "I will protect all helps!",
      "I will become the ultimate aider!",
      "I will make aid eternal!",
      "I will never lose my help!",
      "I will fight for all assistances!",
      "I will protect all services!",
      "I will become the ultimate assistant!",
      "I will make assistance universal!",
      "I will never forget my service!",
      "I will become the ultimate server!",
      "I will surpass all neglects!",
      "I will make service worldwide!",
      "I will never abandon my assistance!",
      "I will fight for all cooperations!",
      "I will protect all partnerships!",
      "I will become the ultimate cooperator!",
      "I will make cooperation eternal!",
      "I will never lose my partnership!",
      "I will fight for all collaborations!",
      "I will protect all alliances!",
      "I will become the ultimate collaborator!",
      "I will make collaboration universal!",
      "I will never forget my alliance!",
      "I will become the ultimate ally!",
      "I will surpass all isolations!",
      "I will make alliance global!",
      "I will never abandon my collaboration!",
      "I will fight for all synergies!",
      "I will protect all harmonies!",
      "I will become the ultimate synergist!",
      "I will make synergy eternal!",
      "I will never lose my harmony!",
      "I will fight for all balances!",
      "I will protect all equilibria!",
      "I will become the ultimate balancer!",
      "I will make balance universal!",
      "I will never forget my equilibrium!",
      "I will become the ultimate equilibrator!",
      "I will surpass all imbalances!",
      "I will make equilibrium worldwide!",
      "I will never abandon my balance!",
      "I will fight for all harmonies!",
      "I will protect all concordances!",
      "I will become the ultimate harmonious!",
      "I will make harmony eternal!",
      "I will never lose my concordance!",
      "I will fight for all agreements!",
      "I will protect all consensuses!",
      "I will become the ultimate agreeable!",
      "I will make agreement universal!",
      "I will never forget my consensus!",
      "I will become the ultimate consensual!",
      "I will surpass all disagreements!",
      "I will make consensus global!",
      "I will never abandon my agreement!",
      "I will fight for all unities!",
      "I will protect all onenesses!",
      "I will become the ultimate united!",
      "I will make unity eternal!",
      "I will never lose my oneness!",
      "I will fight for all wholes!",
      "I will protect all integrities!",
      "I will become the ultimate whole!",
      "I will make integrity universal!",
      "I will never forget my whole!",
      "I will become the ultimate integral!",
      "I will surpass all divisions!",
      "I will make whole worldwide!",
      "I will never abandon my integrity!",
      "I will fight for all completennesses!",
      "I will protect all totalities!",
      "I will become the ultimate complete!",
      "I will make completeness eternal!",
      "I will never lose my totality!",
      "I will fight for all entireties!",
      "I will protect all wholenesses!",
      "I will become the ultimate entire!",
      "I will make entirety universal!",
      "I will never forget my wholeness!",
      "I will become the ultimate whole!",
      "I will surpass all incompletenesses!",
      "I will make wholeness global!",
      "I will never abandon my completeness!",
      "I will fight for all integrities!",
      "I will protect all unities!",
      "I will become the ultimate integral!",
      "I will make integrity eternal!",
      "I will never lose my unity!",
      "I will fight for all cohesions!",
      "I will protect all adhesions!",
      "I will become the ultimate cohesive!",
      "I will make cohesion universal!",
      "I will never forget my adhesion!",
      "I will become the ultimate adhesive!",
      "I will surpass all separations!",
      "I will make adhesion worldwide!",
      "I will never abandon my cohesion!",
      "I will fight for all bonds!",
      "I will protect all connections!",
      "I will become the ultimate bonded!",
      "I will make bond eternal!",
      "I will never lose my connection!",
      "I will fight for all links!",
      "I will protect all ties!",
      "I will become the ultimate linked!",
      "I will make link universal!",
      "I will never forget my tie!",
      "I will become the ultimate tied!",
      "I will surpass all disconnections!",
      "I will make tie global!",
      "I will never abandon my link!",
      "I will fight for all attachments!",
      "I will protect all fastenings!",
      "I will become the ultimate attached!",
      "I will make attachment eternal!",
      "I will never lose my fastening!",
      "I will fight for all bindings!",
      "I will protect all holdings!",
      "I will become the ultimate bound!",
      "I will make binding universal!",
      "I will never forget my holding!",
      "I will become the ultimate holder!",
      "I will surpass all releases!",
      "I will make holding worldwide!",
      "I will never abandon my binding!",
      "I will fight for all unions!",
      "I will protect all marriages!",
      "I will become the ultimate united!",
      "I will make union eternal!",
      "I will never lose my marriage!",
      "I will fight for all combinations!",
      "I will protect all mergers!",
      "I will become the ultimate combined!",
      "I will make combination universal!",
      "I will never forget my merger!",
      "I will become the ultimate merged!",
      "I will surpass all separations!",
      "I will make merger global!",
      "I will never abandon my combination!",
      "I will fight for all integrations!",
      "I will protect all incorporations!",
      "I will become the ultimate integrated!",
      "I will make integration eternal!",
      "I will never lose my incorporation!",
      "I will fight for all assimilations!",
      "I will protect all absorptions!",
      "I will become the ultimate assimilated!",
      "I will make assimilation universal!",
      "I will never forget my absorption!",
      "I will become the ultimate absorbed!",
      "I will surpass all segregations!",
      "I will make absorption worldwide!",
      "I will never abandon my assimilation!",
      "I will fight for all inclusions!",
      "I will protect all encompassments!",
      "I will become the ultimate included!",
      "I will make inclusion eternal!",
      "I will never lose my encompassment!",
      "I will fight for all containments!",
      "I will protect all holdings!",
      "I will become the ultimate contained!",
      "I will make containment universal!",
      "I will never forget my holding!",
      "I will become the ultimate holder!",
      "I will surpass all exclusions!",
      "I will make holding global!",
      "I will never abandon my inclusion!",
      "I will fight for all acceptances!",
      "I will protect all welcomes!",
      "I will become the ultimate accepted!",
      "I will make acceptance eternal!",
      "I will never lose my welcome!",
      "I will fight for all receptions!",
      "I will protect all greetings!",
      "I will become the ultimate received!",
      "I will make reception universal!",
      "I will never forget my greeting!",
      "I will become the ultimate greeter!",
      "I will surpass all rejections!",
      "I will make greeting worldwide!",
      "I will never abandon my acceptance!",
      "I will fight for all admissions!",
      "I will protect all entries!",
      "I will become the ultimate admitted!",
      "I will make admission eternal!",
      "I will never lose my entry!",
      "I will fight for all accesses!",
      "I will protect all entrances!",
      "I will become the ultimate accessed!",
      "I will make access universal!",
      "I will never forget my entrance!",
      "I will become the ultimate entrer!",
      "I will surpass all denials!",
      "I will make entrance global!",
      "I will never abandon my admission!",
      "I will fight for all permissions!",
      "I will protect all allowances!",
      "I will become the ultimate permitted!",
      "I will make permission eternal!",
      "I will never lose my allowance!",
      "I will fight for all licenses!",
      "I will protect all authorizations!",
      "I will become the ultimate licensed!",
      "I will make license universal!",
      "I will never forget my authorization!",
      "I will become the ultimate authorized!",
      "I will surpass all prohibitions!",
      "I will make authorization worldwide!",
      "I will never abandon my permission!",
      "I will fight for all freedoms!",
      "I will protect all liberties!",
      "I will become the ultimate free!",
      "I will make freedom eternal!",
      "I will never lose my liberty!",
      "I will fight for all autonomies!",
      "I will protect all independences!",
      "I will become the ultimate autonomous!",
      "I will make autonomy universal!",
      "I will never forget my independence!",
      "I will become the ultimate independent!",
      "I will surpass all dependencies!",
      "I will make independence global!",
      "I will never abandon my freedom!",
      "I will fight for all releases!",
      "I will protect all liberations!",
      "I will become the ultimate released!",
      "I will make release eternal!",
      "I will never lose my liberation!",
      "I will fight for all emancipations!",
      "I will protect all frees!",
      "I will become the ultimate emancipated!",
      "I will make emancipation universal!",
      "I will never forget my free!",
      "I will become the ultimate freer!",
      "I will surpass all captivities!",
      "I will make free worldwide!",
      "I will never abandon my liberation!",
      "I will fight for all deliverances!",
      "I will protect all salvations!",
      "I will become the ultimate delivered!",
      "I will make deliverance eternal!",
      "I will never lose my salvation!",
      "I will fight for all rescues!",
      "I will protect all redemptions!",
      "I will become the ultimate rescued!",
      "I will make rescue universal!",
      "I will never forget my redemption!",
      "I will become the ultimate redeemer!",
      "I will surpass all damnations!",
      "I will make redemption global!",
      "I will never abandon my deliverance!",
      "I will fight for all liberations!",
      "I will protect all freedoms!",
      "I will become the ultimate liberator!",
      "I will make liberation eternal!",
      "I will never lose my freedom!",
      "I will fight for all independences!",
      "I will protect all sovereignties!",
      "I will become the ultimate independent!",
      "I will make independence universal!",
      "I will never forget my sovereignty!",
      "I will become the ultimate sovereign!",
      "I will surpass all subjections!",
      "I will make sovereignty worldwide!",
      "I will never abandon my independence!",
      "I will fight for all autonomies!",
      "I will protect all self-governances!",
      "I will become the ultimate autonomous!",
      "I will make autonomy eternal!",
      "I will never lose my self-governance!",
      "I will fight for all self-determinations!",
      "I will protect all self-rules!",
      "I will become the ultimate self-determined!",
      "I will make self-determination universal!",
      "I will never forget my self-rule!",
      "I will become the ultimate self-ruler!",
      "I will surpass all controls!",
      "I will make self-rule global!",
      "I will never abandon my autonomy!",
      "I will fight for all self-sufficiencies!",
      "I will protect all self-reliances!",
      "I will become the ultimate self-sufficient!",
      "I will make self-sufficiency eternal!",
      "I will never lose my self-reliance!",
      "I will fight for all self-supports!",
      "I will protect all self-maintenances!",
      "I will become the ultimate self-supported!",
      "I will make self-support universal!",
      "I will never forget my self-maintenance!",
      "I will become the ultimate self-maintainer!",
      "I will surpass all dependencies!",
      "I will make self-maintenance worldwide!",
      "I will never abandon my self-sufficiency!",
      "I will fight for all self-sustainments!",
      "I will protect all self-preservations!",
      "I will become the ultimate self-sustained!",
      "I will make self-sustenance eternal!",
      "I will never lose my self-preservation!",
      "I will fight for all self-conservations!",
      "I will protect all self-safeguards!",
      "I will become the ultimate self-conserved!",
      "I will make self-conservation universal!",
      "I will never forget my self-safeguard!",
      "I will become the ultimate self-safeguarder!",
      "I will surpass all vulnerabilities!",
      "I will make self-safeguard global!",
      "I will never abandon my self-preservation!",
      "I will fight for all self-defenses!",
      "I will protect all self-protections!",
      "I will become the ultimate self-defended!",
      "I will make self-defense eternal!",
      "I will never lose my capability!",
      "I will fight for all abilities!",
      "I will protect all skills!",
      "I will become the ultimate able!",
      "I will make ability universal!",
      "I will never forget my skill!",
      "I will become the ultimate skilled!",
      "I will surpass all inabilities!",
      "I will make skill worldwide!",
      "I will never abandon my competence!",
      "I will fight for all proficiencies!",
      "I will protect all expertises!",
      "I will become the ultimate competent!",
      "I will make competence eternal!",
      "I will never lose my proficiency!",
      "I will fight for all masteries!",
      "I will protect all supremacies!",
      "I will become the ultimate proficient!",
      "I will make proficiency universal!",
      "I will never forget my expertise!",
      "I will become the ultimate expert!",
      "I will surpass all novices!",
      "I will make expertise global!",
      "I will never abandon my specialization!",
      "I will fight for all focuses!",
      "I will protect all concentrations!",
      "I will become the ultimate specialist!",
      "I will make specialization eternal!",
      "I will never lose my focus!",
      "I will fight for all attentions!",
      "I will protect all concentrations!",
      "I will become the ultimate focused!",
      "I will make focus universal!",
      "I will never forget my attention!",
      "I will become the ultimate attentive!",
      "I will surpass all distractions!",
      "I will make attention worldwide!",
      "I will never abandon my concentration!",
      "I will fight for all intensifications!",
      "I will protect all intensives!",
      "I will become the ultimate concentrated!",
      "I will make concentration eternal!",
      "I will never lose my intensity!",
      "I will fight for all depths!",
      "I will protect all profundities!",
      "I will become the ultimate intense!",
      "I will make intensity universal!",
      "I will never forget my depth!",
      "I will become the ultimate profound!",
      "I will surpass all superficialities!",
      "I will make profundity global!",
      "I will never abandon my seriousness!",
      "I will fight for all gravities!",
      "I will protect all importances!",
      "I will become the ultimate serious!",
      "I will make seriousness eternal!",
      "I will never lose my gravity!",
      "I will fight for all significances!",
      "I will protect all meanings!",
      "I will become the ultimate significant!",
      "I will make significance universal!",
      "I will never forget my meaning!",
      "I will become the ultimate meaningful!",
      "I will surpass all irrelevances!",
      "I will make meaning worldwide!",
      "I will never abandon my purpose!",
      "I will fight for all objectives!",
      "I will protect all goals!",
      "I will become the ultimate purposeful!",
      "I will make purpose eternal!",
      "I will never lose my objective!",
      "I will fight for all aims!",
      "I will protect all targets!",
      "I will become the ultimate objective!",
      "I will make objective universal!",
      "I will never forget my aim!",
      "I will become the ultimate aimed!",
      "I will surpass all aimlessnesses!",
      "I will make aim global!",
      "I will never abandon my target!",
      "I will fight for all destinations!",
      "I will protect all ends!",
      "I will become the ultimate targeted!",
      "I will make target eternal!",
      "I will never lose my destination!",
      "I will fight for all journeys!",
      "I will protect all paths!",
      "I will become the ultimate destined!",
      "I will make destination universal!",
      "I will never forget my journey!",
      "I will become the ultimate journeyer!",
      "I will surpass all losts!",
      "I will make journey worldwide!",
      "I will never abandon my path!",
      "I will fight for all ways!",
      "I will protect all roads!",
      "I will become the ultimate wayfarer!",
      "I will make path eternal!",
      "I will never lose my way!",
      "I will fight for all directions!",
      "I will protect all guidances!",
      "I will become the ultimate directed!",
      "I will make direction universal!",
      "I will never forget my guidance!",
      "I will become the ultimate guided!",
      "I will surpass all misdirections!",
      "I will make guidance global!",
      "I will never abandon my leadership!",
      "I will fight for all guidances!",
      "I will protect all directions!",
      "I will become the ultimate leader!",
      "I will make leadership eternal!",
      "I will never lose my guidance!",
      "I will fight for all directions!",
      "I will protect all paths!",
      "I will become the ultimate guider!",
      "I will make guidance universal!",
      "I will never forget my direction!",
      "I will become the ultimate director!",
      "I will surpass all confusions!",
      "I will make direction worldwide!",
      "I will never abandon my clarity!",
      "I will fight for all lucidities!",
      "I will protect all transparencies!",
      "I will become the ultimate clear!",
      "I will make clarity eternal!",
      "I will never lose my lucidity!",
      "I will fight for all understandings!",
      "I will protect all comprehensions!",
      "I will become the ultimate lucid!",
      "I will make lucidity universal!",
      "I will never forget my understanding!",
    ];
    this.currentText = '';
    this.isTyping = false;
    this.isDeleting = false;
    this.loopNum = 0;
    this.typingSpeed = 100;
    this.deletingSpeed = 50;
    this.pauseTime = 2000;

    this.init();
  }

  init() {
    this.startTyping();
  }

  startTyping() {
    const current = this.loopNum % this.words.length;
    const fullText = this.words[current];

    if (this.isDeleting) {
      // Deleting text
      this.currentText = fullText.substring(0, this.currentText.length - 1);
      this.typingSpeed = this.deletingSpeed;
    } else {
      // Typing text
      this.currentText = fullText.substring(0, this.currentText.length + 1);
      this.typingSpeed = 100;
    }

    this.typingText.textContent = this.currentText;

    if (!this.isDeleting && this.currentText === fullText) {
      // Pause at end of typing
      this.isTyping = false;
      setTimeout(() => {
        this.isDeleting = true;
        this.startTyping();
      }, this.pauseTime);
    } else if (this.isDeleting && this.currentText === '') {
      // Finished deleting
      this.isDeleting = false;
      this.loopNum++;
      setTimeout(() => {
        this.startTyping();
      }, 500);
    } else {
      // Continue typing or deleting
      setTimeout(() => {
        this.startTyping();
      }, this.typingSpeed);
    }
  }
}

// Starfield Background Manager
class StarfieldManager {
  constructor() {
    this.starsContainer = document.querySelector('.stars');
    this.starCount = 200;
    this.init();
  }

  init() {
    this.createStars();
  }

  createStars() {
    // Globe position and size (approximate)
    const globeCenterX = 85; // Right side positioning
    const globeCenterY = 50; // Center vertically
    const globeRadius = 15; // Approximate radius as percentage

    for (let i = 0; i < this.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      let x, y, attempts = 0;

      // Generate star position, avoiding globe area
      do {
        x = Math.random() * 100;
        y = Math.random() * 100;

        // Calculate distance from globe center
        const distanceFromGlobe = Math.sqrt(
          Math.pow(x - globeCenterX, 2) + Math.pow(y - globeCenterY, 2)
        );

        attempts++;
        // If too close to globe or too many attempts, try again
      } while (distanceFromGlobe < globeRadius + 5 && attempts < 50);

      // Random size (0.5-4px) for more variety
      const size = Math.random() * 3.5 + 0.5;

      // Random star type for different behaviors
      const starType = Math.random();

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Assign different animation classes based on random type
      if (starType < 0.3) {
        star.classList.add('star-steady'); // Steady glow
      } else if (starType < 0.6) {
        star.classList.add('star-blink'); // Quick blink
      } else if (starType < 0.8) {
        star.classList.add('star-twinkle'); // Slow twinkle
      } else {
        star.classList.add('star-flicker'); // Random flicker
      }

      // Add brightness variation
      const brightness = 0.3 + Math.random() * 0.7; // 0.3 to 1.0
      star.style.opacity = brightness;

      this.starsContainer.appendChild(star);
    }
  }
}

// Globe Animation Manager
class GlobeAnimationManager {
  constructor() {
    this.globeContainer = document.querySelector('.globe-container');
    this.connectionLines = document.querySelectorAll('.connection-line');
    this.impactCircles = document.querySelectorAll('.impact-circle');
    this.sparks = document.querySelectorAll('.spark');
    this.particles = document.querySelectorAll('.particle');

    this.init();
  }

  init() {
    this.setupAnimations();
  }

  setupAnimations() {
    // Connection lines are already animated via CSS
    // Impact circles are already animated via CSS
    // Sparks are already animated via CSS
    // Particles are already animated via CSS
  }

  // Method to add new rocket lines dynamically
  addRocketLine(angle, delay = 0) {
    const line = document.createElement('div');
    line.className = 'connection-line';
    line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    line.style.animationDelay = `${delay}s, ${delay}s`;

    document.querySelector('.connection-lines').appendChild(line);
  }

  // Method to customize animation timing
  setAnimationTiming(rocketDuration = 6, colorShiftDuration = 3) {
    const style = document.createElement('style');
    style.textContent = `
      .connection-line {
        animation-duration: ${rocketDuration}s, ${colorShiftDuration}s;
      }
    `;
    document.head.appendChild(style);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navButton = document.getElementById('navButton');
    this.navPopup = document.getElementById('navPopup');
    this.navLinks = document.querySelectorAll('.nav-popup-link');

    this.init();
  }

  init() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Toggle popup on button click
    if (this.navButton) {
      this.navButton.addEventListener('click', () => this.toggleNavPopup());
    }

    // Close popup when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));

    // Active nav link highlighting
    this.highlightActiveNavLink();

    // Update active nav link based on scroll position
    window.addEventListener('scroll', () => this.highlightActiveNavLink());
  }

  handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop; // No need to account for navbar height

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Update active link
      this.updateActiveNavLink(targetId.substring(1));

      // Close navigation popup
      this.closeNavPopup();
    }
  }

  updateActiveNavLink(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.updateActiveNavLink(sectionId);
      }
    });
  }

  toggleNavPopup() {
    this.navPopup.classList.toggle('active');
  }

  closeNavPopup() {
    this.navPopup.classList.remove('active');
  }

  handleOutsideClick(e) {
    if (!this.navButton.contains(e.target) && !this.navPopup.contains(e.target)) {
      this.closeNavPopup();
    }
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );

      // Observe elements for animation
      const animateElements = document.querySelectorAll(
        '.skill-progress, .portfolio-item, .stat, .about-text, .contact-info'
      );

      animateElements.forEach(el => {
        this.observer.observe(el);
      });
    }

    // Add stagger animation to skill bars
    this.animateSkillBars();

    // Add typing effect to hero title (optional)
    this.addTypingEffect();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';

        // Special handling for skill bars
        if (entry.target.classList.contains('skill-progress')) {
          const progress = entry.target.style.getPropertyValue('--progress');
          entry.target.style.width = progress;
        }
      }
    });
  }

  animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
      bar.style.opacity = '0';
      bar.style.transform = 'translateX(-100%)';
      bar.style.transition = `all 0.8s ease ${index * 0.1}s`;
    });
  }

  addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.innerHTML;
    let isTag = false;
    let textToType = '';

    // Simple typing effect for the highlight text
    const highlightText = document.querySelector('.highlight');
    if (highlightText) {
      const text = highlightText.textContent;
      highlightText.textContent = '';
      highlightText.style.borderRight = '2px solid var(--primary-color)';
      highlightText.style.animation = 'blink 1s infinite';

      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          highlightText.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        } else {
          setTimeout(() => {
            highlightText.style.borderRight = 'none';
            highlightText.style.animation = 'none';
          }, 1000);
        }
      };

      // Start typing effect after a delay
      setTimeout(typeWriter, 1000);
    }
  }
}

// Form Manager
class FormManager {
  constructor() {
    this.contactForm = document.querySelector('.contact-form');
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Add input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', (e) => this.handleInputFocus(e));
      input.addEventListener('blur', (e) => this.handleInputBlur(e));
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.contactForm);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      this.showNotification('Message sent successfully!', 'success');
      this.contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  handleInputFocus(e) {
    e.target.parentElement.classList.add('focused');
  }

  handleInputBlur(e) {
    if (!e.target.value) {
      e.target.parentElement.classList.remove('focused');
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#10b981' : '#3b82f6'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 4000);
  }
}

// Utility Functions
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images if any
    this.lazyLoadImages();

    // Optimize scroll events
    this.optimizeScrollEvents();

    // Preload critical resources
    this.preloadResources();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  optimizeScrollEvents() {
    // Use passive listeners for better performance
    window.addEventListener('scroll', Utils.throttle(() => {
      // Scroll optimizations here
    }, 16), { passive: true });
  }

  preloadResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const lightningManager = new LightningManager();
  const floatingCirclesManager = new FloatingCirclesManager();
  const textGeneratorManager = new TextGeneratorManager();
  const starfieldManager = new StarfieldManager();
  const globeAnimationManager = new GlobeAnimationManager();
  const navigationManager = new NavigationManager();
  const animationManager = new AnimationManager();
  const formManager = new FormManager();
  const performanceManager = new PerformanceManager();

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0%, 50% { border-color: transparent; }
      51%, 100% { border-color: var(--primary-color); }
    }

    .notification {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .form-group.focused input,
    .form-group.focused textarea {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Mobile menu styles */
    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 70px);
        background: var(--bg-primary);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 2rem 0;
        transition: left 0.3s ease;
        border-top: 1px solid var(--border-color);
      }

      .nav-menu.active {
        left: 0;
      }

      .nav-menu .nav-item {
        margin: 1rem 0;
      }

      .nav-link {
        font-size: 1.2rem;
        padding: 0.5rem 1rem;
      }
    }

    /* Smooth animations for all elements */
    * {
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }
  `;
  document.head.appendChild(style);

  console.log('🚀 Portfolio loaded successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when tab becomes visible
    document.body.style.animationPlayState = 'running';
  }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TextGeneratorManager,
    StarfieldManager,
    GlobeAnimationManager,
    NavigationManager,
    AnimationManager,
    FormManager,
    Utils,
    PerformanceManager
  };
}
