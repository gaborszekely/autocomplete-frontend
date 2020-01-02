import React, { useState } from "react";
import "./App.css";
import { SuggestionResponse } from "./types";

const fetchSuggestions = async (
  val: string = ""
): Promise<SuggestionResponse> => {
  const response = await fetch("http://localhost:8000/api/type", {
    method: "POST",
    body: JSON.stringify({ phrase: val })
  });
  return await response.json();
};

const getLastWord = (phrase: string): string => {
  return phrase.split(" ").slice(-1)[0];
};

const App: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<
    number
  >(0);

  const handleInputChange = async (val: string) => {
    setInputVal(val);
    const updatedSuggestions = await fetchSuggestions(val);
    setSuggestions(updatedSuggestions.suggestions);
  };

  const selectSuggestion = (
    e: React.KeyboardEvent<HTMLInputElement>,
    key: number
  ) => {
    // Arrow up key
    if (key === 38) {
      e.preventDefault();
      setSelectedSuggestionIndex(
        selectedSuggestionIndex === 0
          ? suggestions.length - 1
          : selectedSuggestionIndex - 1
      );
    }

    // Arrow down key
    if (key === 40) {
      e.preventDefault();
      setSelectedSuggestionIndex(
        selectedSuggestionIndex === suggestions.length - 1
          ? 0
          : selectedSuggestionIndex + 1
      );
    }
  };

  const autocompleteSuggestion = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.which || e.keyCode;

    selectSuggestion(e, key);

    // Autocomplete on tab press
    if (key === 9) {
      e.preventDefault();
      const lastWord = getLastWord(inputVal);
      const highestSuggestion = suggestions[selectedSuggestionIndex].replace(
        new RegExp(`^${lastWord}`),
        ""
      );
      const updatedInput = inputVal + highestSuggestion;
      setInputVal(updatedInput);
      handleInputChange(updatedInput);
    }
  };

  return (
    <div>
      <p>Start typing!</p>
      <input
        type="text"
        name="input"
        value={inputVal}
        onChange={e => handleInputChange(e.target.value)}
        onKeyDown={autocompleteSuggestion}
      />
      <br />
      <ul>
        {suggestions.map((suggestion, i) => {
          return (
            <li key={suggestion}>
              <span
                className={`suggestion${
                  selectedSuggestionIndex === i ? " selected-suggestion" : ""
                }`}
              >
                {suggestion}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
