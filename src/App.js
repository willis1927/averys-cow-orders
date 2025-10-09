import './App.css';
import WineList from './WineList.csv'
import { useState, useEffect } from 'react';  
import Papa from 'papaparse';

function App() {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  let suggestions = [];
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
  const [basket, setBasket] = useState([]);


  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredSuggestions(
      suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
    );
    if (filteredSuggestions.length === 1 && filteredSuggestions[0].toLowerCase() === value.toLowerCase()) {
      setSelectedValue(data.find(item => item.Wine.toLowerCase() === value.toLowerCase()));
      setFilteredSuggestions([]);
    } else {
      setSelectedValue({});
    }
    if (inputValue.length === 0) {
      setFilteredSuggestions([]);
      setSelectedValue({});
    }
  }

  const handleSelect = (value) => {
    setInputValue(value);
    let searchVal = value.split(" - ")[0];
    
    
    
    setSelectedValue(data.find(item => item.Number === searchVal));
    setFilteredSuggestions([]);
    console.log(selectedValue);
  }

  //load and parse CSV file
  useEffect(() => {
      const fetchData = async () => {
      const response = await fetch(WineList);
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the csv text
      const parsedData = Papa.parse(csv, 
        { header: true ,
          skipEmptyLines: true
        }).data; // object with { data, errors, meta }
      setData(parsedData); // array of objects
      console.log(parsedData);
      
    }
    fetchData();
  }, []);  
    suggestions = data.map(item => `${item.Number} - ${item.Wine}`);
  return (
    <div className="App">
      
        <h1> Orders</h1>
       
      
         <div><h3>Selected Wine</h3>
        <p>Table {selectedValue.Table}, Wine - {selectedValue.Number} </p>
        <p>{selectedValue.Wine} {selectedValue.Vintage}</p>
        <p>1+ Bottles {selectedValue["1Price"]}</p>
        <p>6+ Bottles {selectedValue["6Price"]}</p></div> 
        <div className='autocomplete-container'>
        <button onClick = {() =>{
        setInputValue("")
        setSelectedValue({})
        }}>Clear</button>
        <input 
          className="autocomplete-input"
          type="search"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search for a wine..."
        />
        
        <ul className="autocomplete-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              className='autocomplete-suggestion' 
              key={index} 
              onClick={() => handleSelect(suggestion)}>
              {suggestion}
              </li>
          ))}
          </ul>
        </div>
      
    </div>
  );
}

export default App;
