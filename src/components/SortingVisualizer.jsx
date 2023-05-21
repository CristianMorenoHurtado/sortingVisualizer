import React, { useState } from 'react';
import { getMergeSortAnimations } from './sortingAlgorithms/mergeSort.js';
import { getQuickSortAnimations } from './sortingAlgorithms/quickSort.js';
import { getBubbleSortAnimations } from './sortingAlgorithms/bubbleSort.js';
import './SortingVisualizer.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const ANIMATION_SPEED_MS = 2;
// const NUMBER_OF_ARRAY_BARS = 300;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            arraySize: 200,
        }
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        let length = this.state.arraySize
        for (let i = 0; i < length; i++) {
            array.push(randomIntFromIntervals(5, 500));
        }
        this.setState({ array });
    }

    mergeSort() {
        const animations = getMergeSortAnimations(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isColorChange = i % 3 !== 2;
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = i % 3 === 0 ? 'red' : 'aqua';
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                setTimeout(() => {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = arrayBars[barOneIdx].style;
                    barOneStyle.height = `${newHeight}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    quickSort() {
        const animations = getQuickSortAnimations(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const isColorChange =
                animations[i][0] === "comparison1" ||
                animations[i][0] === "comparison2";
            const arrayBars = document.getElementsByClassName("array-bar");
            if (isColorChange === true) {
                const color = animations[i][0] === "comparison1" ? 'red' : 'aqua';
                const [, barOneIndex, barTwoIndex] = animations[i];
                const barOneStyle = arrayBars[barOneIndex].style;
                const barTwoStyle = arrayBars[barTwoIndex].style;
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                const [, barIndex, newHeight] = animations[i];
                if (barIndex === -1) {
                    continue;
                }
                const barStyle = arrayBars[barIndex].style;
                setTimeout(() => {
                    barStyle.height = `${newHeight}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
        this.handleDisabled()
    }

    bubbleSort() {
        const [animations, randomValue] = getBubbleSortAnimations(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isColorChange = i % 4 === 0 || i % 4 === 1;
            if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = arrayBars[barOneIdx].style;
                const barTwoStyle = arrayBars[barTwoIdx].style;
                const color = i % 4 === 0 ? 'red' : 'aqua';
                setTimeout(() => {
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                }, i * ANIMATION_SPEED_MS);
            } else {
                const [barOneIdx, newHeight] = animations[i];
                if (barOneIdx === -1) {
                    continue;
                }
                const barOneStyle = arrayBars[barOneIdx].style;
                setTimeout(() => {
                    barOneStyle.height = `${newHeight}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
    }

    testSortingAlgorithms() {
        // tests 100 arrays at a time
        for (let i = 0; i < 100; i++) {
            const array = [];
            const length = randomIntFromIntervals(1, 1000);
            for (let i = 0; i < length; i++) {
                array.push(randomIntFromIntervals(-1000, 1000));
            }
            const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
            const mergeSortedArray = getMergeSortAnimations(array.slice());
            console.log(arraysAreEqual(javaScriptSortedArray, mergeSortedArray));
        }
    }

    increaseArray() {
        this.setState({
            arraySize: this.state.arraySize >= 300 ? 300 : this.state.arraySize + 25
        })
    }

    decreaseArray() {
        this.setState({
            arraySize: this.state.arraySize <= 25 ? 25 : this.state.arraySize - 25
        })
    }

    render() {
        const { array } = this.state;
        return (
            <div className='page-container'>
                <h1>Sorting Visualizer</h1>
                <div className='btn-container'>
                    <ButtonGroup className='array-btn-container' role="group">
                        <Button variant='secondary'
                            onClick={()=> this.decreaseArray()}>
                            <FontAwesomeIcon icon="fa-solid fa-minus" />
                        </Button>
                        <Button variant='secondary'
                            onClick={() => this.resetArray()}>
                            Generate New Array: {this.state.arraySize} Bars
                        </Button>
                        <Button variant='secondary'
                            onClick={()=> this.increaseArray()}>
                            <FontAwesomeIcon icon="fa-solid fa-plus" />
                        </Button>
                    </ButtonGroup>
                    <div className='algo-btn-container'>
                        <button className='algo-btn'
                            onClick={() => {this.quickSort()}}>Quick Sort</button>
                        <button className='algo-btn'
                            onClick={() => this.mergeSort()}>Merge Sort</button>
                        <button className='algo-btn'
                            onClick={() => this.bubbleSort()}>Bubble Sort</button>
                    </div>
                </div>
                <div className='array-container' >

                    {array.map((value, index) => (
                        <div
                            className='array-bar'
                            key={index}
                            style={{ height: `${value}px` }}></div>
                    ))}
                </div>
            </div>
        );
    }
}

// generate random numbers
export function randomIntFromIntervals(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// checks to make sure the two arrays are equal
function arraysAreEqual(arrayOne, arrayTwo) {
    if (arrayOne.length !== arrayTwo.length) return false;
    for (let i = 0; i < arrayOne.length; i++) {
        if (arrayOne[i] !== arrayTwo[i]) return false;
    }
    return true;
}

    
