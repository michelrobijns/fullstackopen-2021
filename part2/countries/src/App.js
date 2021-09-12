import React, { useState, useEffect } from "react";
import axios from "axios";

const Search = ({ searchText, searchTextChangeHander}) => {
  return (
    <div>
      find countries <input value={searchText} onChange={searchTextChangeHander} />
    </div>
  );
}

const Country = ({ country }) => {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <div>
        {country.name} <button onClick={() => setShow(!show)}>hide</button>
        <CountryDetail country={country} />
      </div>
    )
  }

  return (
    <div>
      {country.name} <button onClick={() => setShow(!show)}>show</button>
    </div>
  );
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital}`)
      .then(response => {
        setWeather(response.data);
      })
  }, []);

  if (weather.current) {
    return (
      <div>
        <h1>{country.name}</h1>
        capital {country.capital}<br />
        population {country.population}
        <h2>languages</h2>
        <ul>
          {country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
        </ul>
        <img src={country.flag} alt={`Flag of ${country.name}`} />
        <h2>Weather in {country.capital}</h2>
        <strong>temperature:</strong> {weather.current.temperature} Celcius<br />
        <img src={weather.current.weather_icons} alt={`Weather in ${country.capital}`} /><br />
        <strong>wind:</strong>{weather.current.wind_speed} km/h direction {weather.current.wind_dir}
      </div>
    );
  }

  return (
    <div>
      <h1>{country.name}</h1>
      capital {country.capital}<br />
      population {country.population}
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.iso639_1}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} />
    </div>
  );
}

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return (
      <>Too many matches, specify another filter</>
    );
  }

  if (countries.length === 1) {
    return (
      <CountryDetail country={countries[0]} />
    );
  }

  return (
    <div>
      {countries.map(country => <Country key={country.alpha2Code} country={country} />)}
    </div>
  );
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  const searchTextChangeHander = (event) => {
    setSearchText(event.target.value);
  }

  const filtereredCountries = countries.filter(country => {
    return country.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div>
      <Search searchText={searchText} searchTextChangeHander={searchTextChangeHander}/>
      <Countries countries={filtereredCountries} />
    </div>
  );
}

export default App;
