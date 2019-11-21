// React
import React, {useState, useEffect, useRef, useCallback, Fragment} from 'react';
import produce from "immer"

// Constant
const numRows = 30;
const numCols = 50;

const initGrid = () => {
  const rows = []
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

const operations = [
  [
    1, -1
  ],
  [
    1, 1
  ],
  [
    -1, -1
  ],
  [
    0, 1
  ],
  [
    0, -1
  ],
  [
    -1, 0
  ],
  [
    1, 0
  ],
  [
    -1, 1
  ]
]

const App = () => {

  const [start, setStart] = useState(false)

  const runningRef = useRef(start);
  runningRef.current = start

  const [grid, setGrid] = useState(() => {
    return initGrid()
  })

  const runSimulation = useCallback(() => {

    if (!runningRef.current) {
      return
    }

    setGrid(g => {
      return produce(g, newState => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neig = 0;
            operations.forEach(([x, y]) => {
              const getX = i + x;
              const getY = j + y
              if (getX >= 0 && getX < numRows && getY >= 0 && getY < numCols) {
                neig += g[getX][getY]
              }
            });

            if (neig < 2 || neig > 3) {
              newState[i][j] = 0;
            } else if (g[i][j] === 0 && neig === 3) {
              newState[i][j] = 1;
            }
          }
        }

      })
    })
    setTimeout(runSimulation, 1000);
  }, [])

  // useEffect(() => {
  //   console.log(grid)
  // }, [grid])

  return (<Fragment>
    <button onClick={() => {
        setStart(!start)
        if (!start) {
          runningRef.current = true;
          runSimulation();
        }
      }} style={{
        marginLeft: "15px"
      }}>{
        !start
          ? "start"
          : "cancel"
      }</button>
    <div className="App" style={{
        marginLeft: "15px",
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>

      {
        grid.map((rows, i) => rows.map((col, j) => (<div key={`${i}-${j}`} onClick={() => {
            const updateGrid = produce(grid, newState => {
              newState[i][j] = grid[i][j]
                ? 0
                : 1;
            });
            setGrid(updateGrid)
          }} style={{
            width: "20px",
            height: "20px",
            backgroundColor: grid[i][j]
              ? "black"
              : "white",
            border: "solid 1px grey"
          }}/>)))
      }
    </div>
  </Fragment>);
}

export default App;
