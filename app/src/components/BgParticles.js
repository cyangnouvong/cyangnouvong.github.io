import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const BgParticles = () => {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    return (
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: '#2e3a4d', // #72929C
              },
            },
            fpsLimit: 60,
            fullScreen: {
              enable: true,
              zIndex: -1,
            },
            interactivity: {
              events: {
                  onHover: {
                      enable: true,
                      mode: "repulse",
                  },
              },
              modes: {
                  push: {
                      quantity: 4,
                  },
                  repulse: {
                      distance: 200,
                      duration: 0.4,
                  },
              },
            },
            particles: {
              color: {
                value: '#FFFFFF',
              },
              links: {
                color: '#FFFFFF',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 2,
                /*
                triangles: {
                  enable: true,
                  color: '#FFFFFF',
                  opacity: 0.1,
                  frequency: 0.3,
                },
                */
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: 'none',
                enable: true,
                random: true,
                speed: 4,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 1000,
                },
                value: 40,
              },
              opacity: {
                value: 0.7,
              },
              shape: {
                type: 'polygon',
                
              },
              size: {
                random: true,
                value: 4,
              },
            },
            detectRetina: true,
          }}
        />
      );
}

export default BgParticles;