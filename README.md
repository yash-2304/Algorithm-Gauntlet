#Algorithm Gauntlet

A real-time pathfinding algorithm visualization and benchmarking system designed to compare multiple graph traversal strategies under identical conditions. This project enables interactive exploration of algorithm behavior, performance trade-offs, and cost-based decision-making in weighted and unweighted grids.

⸻

##Overview

Algorithm Gauntlet is built to provide both visual intuition and analytical insight into classic pathfinding algorithms. It supports real-time execution, multi-algorithm comparison, and detailed performance metrics, allowing users to understand not only how algorithms work, but when and why they should be used.

⸻

##Key Features

###Multi-Algorithm Support

* Breadth-First Search (BFS)
* Depth-First Search (DFS)
* Dijkstra’s Algorithm
* A* Search
* Greedy Best-First Search
* Bidirectional BFS

###Real-Time Visualization

* Step-by-step exploration of nodes
* Distinct visual encoding per algorithm
* Multiple viewing modes:
    * Exploration (visited nodes)
    * Path (final path)
    * Focus (algorithm-specific highlighting)

###Comparative Execution

* Run up to three algorithms simultaneously
* Evaluate differences in:
    * Steps taken
    * Time to reach goal
    * Total traversal cost

###Performance Metrics

* Step count tracking per algorithm
* Goal detection timing
* Cost-based evaluation (weighted nodes)
* Identification of:
    * Fastest algorithm
    * Most efficient algorithm (minimum cost)

###Interactive Grid System

* Dynamic grid generation
* User-controlled editing:
    * Walls (blocked nodes)
    * Weighted terrain (mud)
* Randomized weight distribution

###Algorithm Insight Panel

* Context-aware explanations based on active selection
* Includes:
    * Detailed descriptions
    * Use-case guidance
    * Time and space complexity
    * Strengths and limitations

⸻


##System Design

###Architecture

The system is structured around a modular design:

* Agent Layer
    Each algorithm is implemented as an independent agent with a unified interface (step(), getVisited(), getPath()).
* Visualization Layer
    Handles rendering of grid state, visited nodes, and final paths in real time.
* State Management
    Centralized store (Zustand) manages grid state, node types, and shared data.
* Comparison Engine
    Executes multiple agents concurrently and aggregates performance metrics.

⸻

| Algorithm          | Optimal | Weighted Support | Strategy                  |
|------------------|--------|------------------|---------------------------|
| BFS              | Yes    | No               | Level-order traversal     |
| DFS              | No     | No               | Depth-first exploration   |
| Dijkstra         | Yes    | Yes              | Minimum cumulative cost   |
| A*               | Yes    | Yes              | Cost + heuristic          |
| Greedy           | No     | No               | Heuristic-driven          |
| Bidirectional BFS| Yes    | No               | Dual-front search         |



##Technical Stack

* Frontend: React (Next.js)
* Language: TypeScript
* Styling: Tailwind CSS
* State Management: Zustand
* Algorithm Engine: Custom implementations

⸻

##Getting Started

###Prerequisites

* Node.js (v16 or higher)
* npm or yarn

##Installation
```
git clone https://github.com/yash-2304/Algorithm-Gauntlet.git
cd Algorithm-Gauntlet
npm install
npm run dev
```

##Run Application

Open:
http://localhost:3000

##Usage

1. Select one or more algorithms
2. Configure the grid:
    * Add walls or weighted nodes
3. Choose a visualization mode
4. Start execution:
    * Single algorithm run
    * Compare mode (up to 3 algorithms)
5. Observe:
    * Exploration patterns
    * Final paths
    * Performance metrics

⸻

##Example Scenarios

* Unweighted grid: Compare BFS vs DFS
* Weighted grid: Compare Dijkstra vs A*
* Heuristic evaluation: Observe Greedy vs A* behavior
* Large grid: Evaluate Bidirectional BFS efficiency

⸻

##Future Enhancements

* Maze generation algorithms (DFS, Prim’s, Recursive Division)
* Heuristic selection for A*
* Time-based benchmarking (performance profiling)
* Path overlay comparison across algorithms
* Export and share grid states
* Advanced analytics dashboard

⸻

##Author

Yash Prajapati
GitHub: https://github.com/yash-2304
LinkedIn: https://www.linkedin.com/in/yash-prajapati-29a423187

⸻

##License

This project is open-source and available under the MIT License.

⸻

##Final Note

This project demonstrates not only the implementation of classical algorithms, but also the ability to design systems that expose their behavior, trade-offs, and performance characteristics in a clear and interactive manner.
