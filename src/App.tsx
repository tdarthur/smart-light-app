import useScrollPosition from './hooks/useScrollPosition';

function App() {
    const scrollPosition = useScrollPosition();

    console.log(scrollPosition);

    return (
        <>
            <div className="landing" style={{ opacity: 1 - scrollPosition / window.innerHeight }}>
                <div className="landing-graphic landing-spotlight" />
                <div className="landing-graphic landing-pointlight" />

                <div className="landing-text">
                    <h2>Light up your life with</h2>
                    <h1>Illuminous</h1>
                </div>
                <div className="landing-action-text">Check out our products below</div>
            </div>

            <div className="products"></div>

            <div className="demo"></div>
        </>
    );
}

export default App;
