import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MSc from './pages/MSc';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header>
                    <h1>Welcome to My Website</h1>
                    <nav>
                        <Link to="/"><button>Home</button></Link>
                        <Link to="/msc"><button>MSc Page</button></Link>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/msc" element={<MSc />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
