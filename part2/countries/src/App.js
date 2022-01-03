import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Search = ({ searchText, searchTextChangeHander }) => {
  return (
    <div>
      find countries <input value={searchText} onChange={searchTextChangeHander} />
    </div>
  )
}

const CountryListItem = ({ country }) => {
  const [show, setShow] = useState(false)

  if (show) {
    return (
      <div>
        {country.name.common} <button onClick={() => setShow(!show)}>hide</button>
        <CountryDetail country={country} />
      </div>
    )
  }

  return (
    <div>
      {country.name.common} <button onClick={() => setShow(!show)}>show</button>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if (weather.main) {
    return (
      <div>
        <h1>{country.name.common}</h1>
        capital {country.capital}<br />
        population {country.population}
        <h2>languages</h2>
        <ul>
          {Object.entries(country.languages).map((language) =>
            <li key={language[0]}>
              {language[1]}
            </li>
          )}
        </ul>
        <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" />
        <h2>Weather in {country.capital}</h2>
        <strong>temperature:</strong> {weather.main.temp} Celcius<br />
        <strong>wind:</strong>{weather.wind.speed} m/s direction {weather.wind.deg}
      </div>
    )
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      capital {country.capital}<br />
      population {country.population}
      <h2>languages</h2>
      <ul>
        {Object.entries(country.languages).map((language) =>
          <li key={language[0]}>
            {language[1]}
          </li>
        )}
      </ul>
      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" />
    </div>
  )
}

const Results = ({ countries }) => {
  if (countries.length > 10) {
    return (
      <>Too many matches, specify another filter</>
    )
  }

  if (countries.length === 1) {
    return (
      <CountryDetail country={countries[0]} />
    )
  }

  return (
    <div>
      {countries.map(country => <CountryListItem key={country.cca2} country={country} />)}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const searchTextChangeHander = (event) => {
    setSearchText(event.target.value)
  }

  const filtereredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div>
      <Search searchText={searchText} searchTextChangeHander={searchTextChangeHander}/>
      {searchText ? <Results countries={filtereredCountries} /> : ''}
    </div>
  )
}

export default App
