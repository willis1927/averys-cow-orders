import './App.css';
import WineList from './WineList.csv'
import { useState, useEffect } from 'react';  
import Papa from 'papaparse';
import Autocomplete from './Autocomplete';

function App() {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
      
      const filteredResults = data.filter(item => 
        item["Tasting Number"].startsWith(input)
      );
      
      setResult(filteredResults);
    },[input,data]);

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
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="table-container">
        {data.length > 0 ? (
          <form className="data-form">

          <label htmlFor='wine-number'>Wine Number:</label>
          <input id='wine-number' type='number' name='wine-number' value={input} onChange={(e)=>setInput(e.target.value)}/>
          <div id="results">
            {result.length !== data.length ? (result.map(item => (
              <span><p key={item["Tasting Number"]}>{item["Tasting Number"]} - {item.Description}</p><button>Add</button></span>
            ))) : null}
          </div>
          <div>
            <Autocomplete data={data}/>
          </div>
          </form>
          // <table>
          //   <thead>
          //     <tr>
          //       {Object.keys(data[0]).map((key) => (
          //         <th key={key}>{key}</th>
          //       ))}
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {data.map((row, index) => (
          //       <tr key={index}>
          //         {Object.values(row).map((value, i) => (
          //           <td key={i}>{value}</td>
          //         ))}
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>  
        ): null }

        <button onClick={() => console.log(data)}>Log Data</button> 
        <button onClick={() => setData([])}>Clear Data</button>
        <button onClick={() => window.location.reload()}>Reload Data</button>
        
        </div>
        
       
      </header>
    </div>
  );
}

export default App;
