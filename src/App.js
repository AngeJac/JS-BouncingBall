import React, { useEffect, useState } from 'react';
import './App.css';

const board = [
	['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
	['X', '1', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', '0', '0', '0', 'X', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', 'Y', '0', '0', '0', 'X', 'X', 'X', 'X'],
	['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', '0', 'X', '0', '0', '0', '0', 'Y', '0', 'X'],
	['X', '0', '0', 'X', 'X', 'X', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', '0', 'X', '0', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', 'Y', '0', '0', '0', '0', '0', '0', '0', 'X'],
	['X', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'X'],
	['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
];

const BouncingSimulator = () => {
	const [vector, setVector] = useState({ x: 1, y: 1 });
	const [ballPosition, setBallPosition] = useState({});
	const [numOfMoves, setNumOfMoves] = useState(0);
	const [boardState, setBoardState] = useState(board);
	const [startingBallPosition, setStartingBallPosition] = useState({});
	const [intervalId, setIntervalId] = useState(null);
	const [isStopped, setIsStopped] = useState(false);

	useEffect(() => {
		initializeSimulation();
	}, []);

	useEffect(() => {
		if (ballPosition.x !== startingBallPosition.x || ballPosition.y !== startingBallPosition.y) {
			ballsMove();
		} else {
			endOfGame();
		}
	}, [ballPosition]);

	const initializeSimulation = () => {
		const initialBallPosition = getBallPosition();
		setBallPosition(initialBallPosition);
		setStartingBallPosition(initialBallPosition);
		setBoardState(updateBoard(initialBallPosition, boardState));
	};

	const getBallPosition = () => {
		for (let row = 0; row < boardState.length; row++) {
			for (let column = 0; column < boardState[row].length; column++) {
				if (boardState[row][column] === '1') {
					return { x: column, y: row };
				}
			}
		}
		return {};
	};

	const updateBoard = (position, board) => {
		const updatedBoard = [...board];
		updatedBoard[position.y][position.x] = '1';
		return updatedBoard;
	};

	const ballsMove = () => {
		let currentBallPosition = { ...ballPosition };
		let newBallPosition = {
			x: currentBallPosition.x + vector.x,
			y: currentBallPosition.y + vector.y,
		};

		while (boardState[newBallPosition.y][newBallPosition.x] !== 'X' && !isStopped) {
			const updatedBoard = [...boardState];
			updatedBoard[currentBallPosition.y][currentBallPosition.x] = '0';
			updatedBoard[newBallPosition.y][newBallPosition.x] = '1';
			setBoardState(updatedBoard);
			setBallPosition(newBallPosition);
			setNumOfMoves(numOfMoves + 1);

			if (boardState[newBallPosition.y][newBallPosition.x] === 'Y') {
				updatedBoard[newBallPosition.y][newBallPosition.x] = 'X';
				setBoardState(updatedBoard);
				break;
			}

			currentBallPosition = { ...newBallPosition };
			newBallPosition = {
				x: currentBallPosition.x + vector.x,
				y: currentBallPosition.y + vector.y,
			};
		}

		if (!isStopped) {
			moveVectorChange();
		}
	};

	const moveVectorChange = () => {
		if (vector.x === 1 && vector.y === 1) {
			setVector({ x: -1, y: 1 });
		} else if (vector.x === -1 && vector.y === 1) {
			setVector({ x: -1, y: -1 });
		} else if (vector.x === -1 && vector.y === -1) {
			setVector({ x: 1, y: -1 });
		} else if (vector.x === 1 && vector.y === -1) {
			setVector({ x: 1, y: 1 });
		}
	};

	const endOfGame = () => {
		console.log('The ball has returned to its starting position');
		console.log('Number of moves:', numOfMoves);
		clearInterval(intervalId);
		setIntervalId(null);
	};

	const startSimulation = () => {
		if (intervalId || isStopped) return;

		const id = setInterval(() => {
			ballsMove();
		}, 300);

		setIntervalId(id);
	};

	const stopSimulation = () => {
		clearInterval(intervalId);
		setIntervalId(null);
		setIsStopped(true);
	};

	const resetSimulation = () => {
		clearInterval(intervalId);
		setIntervalId(null);
		setVector({ x: 1, y: 1 });
		setNumOfMoves(0);
		setBoardState(board);
		setBallPosition(startingBallPosition);
		setIsStopped(false);
	};

	return (
		<div className='bouncing-simulator'>
			<div className='button-container'>
				<button className='button' onClick={resetSimulation}>
					Reset
				</button>
				<button className='button' onClick={startSimulation}>
					Start
				</button>
				<button
					className={`button stop-button ${isStopped ? 'disabled' : ''}`}
					onClick={stopSimulation}
					disabled={isStopped}
				>
					Stop
				</button>
			</div>

			<div className='board'>
				{boardState.map((rows, rowIndex) => (
					<div key={rowIndex} className='row'>
						{rows.map((cell, columnIndex) => (
							<div
								key={columnIndex}
								className={`square ${cell === 'X' ? 'boundary' : cell === '1' ? 'ball' : cell === 'Y' ? 'target' : ''}`}
							></div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default BouncingSimulator;
