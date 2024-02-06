import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
    type Container,
    type ISourceOptions
} from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import './BgParticles.scss';

const BgParticles = () => {
    const [init, setInit] = useState(false);
    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    
    const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
    };

    const options: ISourceOptions = useMemo(() => ({
        background: {
            color: {
                value: '#2e3a4d'
            },
        },
        fpsLimit: 120,
        fullScreen: {
            enable: true,
            zIndex: -1
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse"
                },
            },
            modes: {
                push: {
                    quantity: 4
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
            },
        },
        particles: {
            color: {
                value: '#ffffff'
            },
            links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 2
            },
            move: {
                direction: 'none',
                enable: true,
                random: true,
                speed: 4,
                straight: false
            },
            collisions: {
                enable: true
            },
            number: {
                density: {
                    enable: true,
                    value_area: 1000
                },
                value: 80
            },
            opacity: {
                value: 0.7
            },
            shape: {
                type: 'polygon'
            },
            size: {
                random: true,
                value: 4
            },
        },
        detectRetina: true
    }), []);

    return (
        <>
            {init && 
                <Particles
                    id='tsparticles'
                    particlesLoaded={particlesLoaded}
                    options={options} 
                    className='background-container'
                />
            }
        </>
    );
}

export default BgParticles;