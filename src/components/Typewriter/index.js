// src/components/Typewriter/index.js
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css'; // Import the CSS module for cursor styling
import GradientText from '../GradientText'; // Make sure this path is correct based on your file structure!

/**
 * A React component that animates text as if it's being typed.
 *
 * @param {object} props
 * @param {string} props.text - The full text string to be typed out.
 * @param {number} [props.delay=100] - Delay in milliseconds between each character.
 * @param {boolean} [props.loop=false] - Whether the animation should loop infinitely.
 * @param {number} [props.eraseDelay=50] - Delay in milliseconds for erasing characters (if looping).
 * @param {number} [props.startDelay=1000] - Delay before typing starts for the first time or after erase.
 * @param {boolean} [props.showCursor=false] - Whether to show a blinking cursor after the text.
 */
export default function Typewriter({ text, delay = 100, loop = false, eraseDelay = 50, startDelay = 1000, showCursor = false }) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let timeout;

    // Typing logic
    if (!isErasing && currentIndex < text.length) {
      setIsTypingComplete(false); // Not complete while typing
      // Determine the delay: startDelay for the very first character of a typing sequence, otherwise normal delay
      const currentCharacterDelay = (currentIndex === 0 && !isErasing) ? startDelay : delay;

      timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, currentCharacterDelay);
    }
    // Logic to start erasing after full text is typed (if looping)
    else if (loop && currentIndex === text.length && !isErasing) {
      setIsTypingComplete(true); // Typing is complete for this cycle
      timeout = setTimeout(() => {
        setIsErasing(true); // Switch to erasing mode
      }, startDelay); // Pause before erasing starts
    }
    // Erasing logic
    else if (isErasing && currentIndex > 0) {
      setIsTypingComplete(false); // Not complete while erasing
      timeout = setTimeout(() => {
        setCurrentText(prevText => prevText.slice(0, -1)); // Remove the last character
        setCurrentIndex(prevIndex => prevIndex - 1);
      }, eraseDelay);
    }
    // Logic to restart typing after full erase (if looping)
    else if (loop && isErasing && currentIndex === 0) {
      setIsTypingComplete(false); // Not complete, ready to type again
      timeout = setTimeout(() => {
        setIsErasing(false); // Switch back to typing mode
      }, startDelay); // Pause before typing starts again
    }
    // Logic for non-looping text when typing is finished
    else if (!loop && currentIndex === text.length) {
      setIsTypingComplete(true); // Typing is permanently complete
    }

    // Cleanup function: Clear the timeout if the component unmounts or effect re-runs
    return () => clearTimeout(timeout);
  }, [currentIndex, isErasing, text, delay, loop, eraseDelay, startDelay]); // Dependencies array

  return (
    <span className={styles.typewriterContainer}>
      {/* This is the key part: wrapping currentText with GradientText and passing animated={true} */}
      <GradientText animated={true}>
        {currentText}
      </GradientText>
      {/* Conditionally render the blinking cursor */}
      {showCursor && (
        // Cursor shown if typing is complete, or if typing/erasing is in progress.
        // It hides when the text is fully erased and waiting to restart (if looping).
        isTypingComplete ||
        (!loop && currentIndex < text.length) ||
        (loop && currentIndex > 0)
      ) && (
        <span className={styles.blinkingCursor}></span>
      )}
    </span>
  );
}