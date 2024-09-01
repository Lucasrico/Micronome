import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { PlayArrow, Pause, ArrowUpward, ArrowDownward, ArrowBack, ArrowForward } from '@mui/icons-material';

const colors = [
    '#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0',
    '#e91e63', '#3f51b5', '#009688', '#ff9800', '#00bcd4'
];

const initialSongs = [
    { "index": 1, "name": "The View From The Afternoon", "bpm": 144 },
    { "index": 2, "name": "D is for Dangerous", "bpm": 143 },
    { "index": 3, "name": "Teddy Picker", "bpm": 150 },
    { "index": 4, "name": "Crying Lightning", "bpm": 106 },
    { "index": 5, "name": "A Certain Romance", "bpm": 141 },
    { "index": 6, "name": "Black Treacle", "bpm": 106 },
    { "index": 7, "name": "Balaclava", "bpm": 136 },
    { "index": 8, "name": "Fluorescent Adolescent", "bpm": 150 },
    { "index": 9, "name": "Don't Sit Down 'Cause I've Moved Your Chair", "bpm": 95 },
    { "index": 10, "name": "Leave Before The Lights Come On", "bpm": 138 },
    { "index": 11, "name": "Mardy Bum", "bpm": 104 },
    { "index": 12, "name": "Snap Out Of It", "bpm": 118 },
    { "index": 13, "name": "Arabella", "bpm": 102 },
    { "index": 14, "name": "When The Sun Goes Down", "bpm": 119 },
    { "index": 15, "name": "From The Ritz To The Rubble", "bpm": 139 },
    { "index": 16, "name": "I Bet You Look Good On The Dancefloor", "bpm": 163 },
    { "index": 17, "name": "Knee Socks", "bpm": 110 },
    { "index": 18, "name": "R U Mine?", "bpm": 108 },
    { "index": 19, "name": "Why'd You Only Call Me When You're High?", "bpm": 92 },
    { "index": 20, "name": "Brianstorm", "bpm": 167 },
    { "index": 21, "name": "505", "bpm": 84 },
    { "index": 22, "name": "Do I Wanna Know?", "bpm": 85 }
];

const initialMetronomes = initialSongs.map((song, index) => ({
    ...song,
    color: colors[index % colors.length],
    isPlaying: false,
}));

const loadMetronomesFromStorage = () => {
    const saved = localStorage.getItem('metronomes');
    return saved ? JSON.parse(saved) : initialMetronomes;
};

const saveMetronomesToStorage = (metronomes) => {
    localStorage.setItem('metronomes', JSON.stringify(metronomes));
};

const debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const Metronome = ({ data, isPlaying, onPlayPause }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let intervalId;
        if (isPlaying && data.bpm > 0) {
            intervalId = setInterval(() => {
                setIsActive(prev => !prev);
            }, 60000 / data.bpm);
        }
        return () => clearInterval(intervalId);
    }, [data.bpm, isPlaying]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center', // Asegurar que el texto esté centrado horizontalmente
                bgcolor: isActive ? data.color : '#121212', // Fondo oscuro casi negro
                transition: 'background-color 0.02s', // Transición más suave
                opacity: isActive ? 1 : 0.8, // Cambio de opacidad para indicar cambio
                padding: 2 // Agregar padding para un mejor ajuste visual
            }}
        >
            <Typography variant="h4" component="div" sx={{ mb: 1, color: 'white', textAlign: 'center' }}>
                {data.name}
            </Typography>
            <Typography variant="h2" component="div" sx={{ mb: 4, color: 'white', textAlign: 'center' }}>
                {data.bpm} BPM
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={onPlayPause}
                    startIcon={isPlaying ? <Pause /> : <PlayArrow />}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
                {/* <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        localStorage.removeItem('metronomes');
                        window.location.reload(); // Recargar la página para aplicar los cambios
                    }}
                >
                    Limpiar LocalStorage
                </Button> */}
            </Box>
        </Box>
    );
};

const VisualMetronome = () => {
    const [metronomes, setMetronomes] = useState(loadMetronomesFromStorage);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        setIsPlaying(prev => !prev); // Cambia el estado global de reproducción
    };

    const debouncedSave = debounce((metronomes) => {
        saveMetronomesToStorage(metronomes);
    }, 2000); // 2 segundos de inactividad antes de guardar

    useEffect(() => {
        debouncedSave(metronomes);
    }, [metronomes]);

    const handleIncreaseBPM = () => {
        setMetronomes(prev => prev.map((m, index) =>
            index === currentIndex ? { ...m, bpm: Math.min(220, m.bpm + 1) } : m
        ));
    };

    const handleDecreaseBPM = () => {
        setMetronomes(prev => prev.map((m, index) =>
            index === currentIndex ? { ...m, bpm: Math.max(40, m.bpm - 1) } : m
        ));
    };

    const handleNextMetronome = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % metronomes.length);
    };

    const handlePreviousMetronome = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + metronomes.length) % metronomes.length);
    };

    return (
        <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Metronome
                data={metronomes[currentIndex]}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
            />
            <Box sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', padding: 2, bgcolor: '#282828' }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleDecreaseBPM}
                            startIcon={<ArrowDownward />}
                        >
                            Bajar BPM
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleIncreaseBPM}
                            startIcon={<ArrowUpward />}
                        >
                            Subir BPM
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handlePreviousMetronome}
                            startIcon={<ArrowBack />}
                        >
                            Anterior
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={handleNextMetronome}
                            startIcon={<ArrowForward />}
                        >
                            Siguiente
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default VisualMetronome;
