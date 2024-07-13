import { useState } from 'react';

function Home() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>Home Page</h2>
            <div className="card">
                <button onClick={() => setCount(count => count + 1)}>
                    Count is {count}
                </button>
            </div>
        </div>
    );
}

export default Home;
