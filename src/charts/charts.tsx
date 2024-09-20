import { useState } from "react";
import MyChart from "./chartComponent.jsx"

const Charts: React.FC = (data) => {
    return (
        <div className="App">
            <h1>График на Chart.js в React</h1>
            <MyChart />
        </div>
    );
};

export default Charts