import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { Colors } from "../../styles/AppStyles";
import { SafeAreaView } from "react-native-safe-area-context";

const { white, black, orange, lightGrey, yellow } = Colors;

const App = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const MAX_TIME = 60;

  const pad = num => {
    return num.toString().padStart(2, "0");
  };

  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 10;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 10));
    }, 10);
    setRunning(true);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };

  const formatTime = totalMilliseconds => {
    const minutes = Math.floor((totalMilliseconds / (100 * 60)) % 60);
    const seconds = Math.floor((totalMilliseconds / 100) % 60);
    const milliseconds = Math.floor((totalMilliseconds % 100) / 1);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  const resumeStopwatch = () => {
    startTimeRef.current = Date.now() - time * 10;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 10));
    }, 10);
    setRunning(true);
  };

  const circumference = 2 * Math.PI * 150;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>ZEN TIMER</Text>
        <View style={styles.line} />
        <View style={styles.svgContainer}>
          <Svg height="360" width="360" viewBox="0 0 360 360">
            <Rect x="0" y="0" width="360" height="360" fill="transparent" />
            <Circle
              cx="180"
              cy="180"
              r="150"
              stroke="yellow"
              strokeWidth="10"
              fill="none"
            />
            <Circle
              cx="180"
              cy="180"
              r="150"
              stroke="white"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (circumference * time) / (MAX_TIME * 100)
              }
            />
            <SvgText
              x="180"
              y="180"
              textAnchor="middle"
              dy=".3em"
              fontSize="48"
              fill="yellow"
            >
              {formatTime(time)}
            </SvgText>
          </Svg>
        </View>
        <Text style={styles.subHeader}>Your Focus</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.focusRestButton]}
            onPress={startStopwatch}
          >
            <Text style={styles.buttonText}>focus</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {running ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={pauseStopwatch}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={resetStopwatch}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {!running && time === 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.startButton]}
                  onPress={startStopwatch}
                >
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {!running && time > 0 && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={resumeStopwatch}
              >
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={resetStopwatch}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 30,
    color: "orange",
    marginBottom: 10
  },
  line: {
    height: 1,
    width: "70%",
    backgroundColor: "orange",
    marginVertical: 10
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: "orange"
  },
  svgContainer: {
    marginVertical: 20
  },
  timeText: {
    fontSize: 48,
    color: "white"
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 0,
    width: "80%",
    justifyContent: "space-between"
  },
  addButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "80%",
    justifyContent: "space-between"
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    width: "40%"
  },
  startButton: {
    backgroundColor: orange,
    color: black
  },
  resetButton: {
    backgroundColor: white
  },
  pauseButton: {
    backgroundColor: orange
  },
  resumeButton: {
    backgroundColor: yellow
  },
  focusRestButton: {
    backgroundColor: orange
  },
  buttonText: {
    color: white,
    fontSize: 16
  }
});

export default App;
