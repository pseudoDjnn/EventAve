function weatherApp() {
  // Create variables
  const cityEl = document.getElementById("city-search");
  const searchEl = document.getElementById("search-button");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const todaysIcon = document.getElementById("weather-picture");
  const currentDescription = document.getElementById("desc");
  const todaysTemp = document.getElementById("temp");
  const todaysHumi = document.getElementById("hum");
  const todaysWind = document.getElementById("wind");
  const todaysUV = document.getElementById("uv");
  const history = document.getElementById("history");

  let fiveDayForecast = document.getElementById("fiveday-header");
  let todaysWeather = document.getElementById("todays-weather");
  //JSON
  let savedSearchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // APIkey
  const apiKey = "84b79da5e5d7c92085660485702f4ce8";

  function getWeatherData(citySearch) {
    // Call first URL to get weather data from openweathermap.org/
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=${apiKey}&units=imperial`;
    // fetch(queryURL).then(function (res) {
    axios.get(queryURL).then(function (res) {
      // console.log(res);

      todaysWeather.classList.remove("hidden");

      // display current weather information for today
      let todaysDate = new Date(res.data.dt * 1000);
      let today = todaysDate.getDate();
      let month = todaysDate.getMonth() + 1;
      let year = todaysDate.getFullYear();
      nameEl.innerText = `${res.data.name}(${month}/${today}/${year})`;
      let weatherIcon = res.data.weather[0].icon;
      todaysIcon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
      );
      todaysIcon.setAttribute("alt", res.data.weather[0].description);
      currentDescription.innerText =
        res.data.weather[0].description.toUpperCase();
      todaysTemp.innerText = `Temp: ${res.data.main.temp} °F`;
      todaysHumi.innerText = `Humidity: ${res.data.main.humidity} %`;
      todaysWind.innerText = `Wind: ${res.data.wind.speed} mph`;

      //Grab second set of weather data from openweathermap.org/
      let latitude = res.data.coord.lat;
      let longitude = res.data.coord.lon;
      let apiUV = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial&cnt=1`;
      axios.get(apiUV).then(function (res) {
        console.log(res);
        let uvCard = document.createElement("span");

        // conditional created to show the strength of UV rays
        if (res.data.current.uvi < 3) {
          uvCard.setAttribute(
            "class",
            "text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-9 py-1.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          );
        } else if (res.data.current.uvi < 7) {
          uvCard.setAttribute(
            "class",
            "text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-9 py-1.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
          );
        } else {
          uvCard.setAttribute(
            "class",
            "text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-9 py-1.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          );
        }
        console.log(res.data.current.uvi);
        uvCard.innerText = res.data.current.uvi;
        todaysUV.innerText = "UV Index of: ";
        todaysUV.append(uvCard);
      });

      let cityID = res.data.id;
      let forecastQueryURL =
        "https://api.openweathermap.org/data/2.5/forecast?id=" +
        cityID +
        "&appid=" +
        apiKey +
        "&units=imperial";
      axios.get(forecastQueryURL).then(function (res) {
        console.log(res);
        fiveDayForecast.classList.remove("hidden");

        // setup five day forecast
        const fiveDay = document.querySelectorAll(".forecast");
        // console.log(fiveDay);
        for (let i = 0; i < fiveDay.length; i++) {
          // console.log("fiveDay", fiveDay + "fiveDay.length", fiveDay.length);
          fiveDay[i].innerHTML = "";
          let forecastIndex = i * 8 + 4;
          let fiveDayDate = new Date(res.data.list[forecastIndex].dt * 1000);
          let fiveDays = fiveDayDate.getDate();
          let fiveDayMonth = fiveDayDate.getMonth() + 1;
          let fiveDayYear = fiveDayDate.getFullYear();
          let fiveDayForecastDate = document.createElement("p");
          fiveDayForecastDate.innerText =
            fiveDayMonth + "/" + fiveDays + "/" + fiveDayYear;
          fiveDay[i].append(fiveDayForecastDate);

          // Icons pulled from openweathermap.org/
          let forecastIcon = document.createElement("img");
          forecastIcon.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" +
              res.data.list[forecastIndex].weather[0].icon +
              "@2x.png"
          );
          forecastIcon.setAttribute(
            "alt",
            res.data.list[forecastIndex].weather[0].description
          );
          fiveDay[i].append(forecastIcon);
          let forecastTemp = document.createElement("p");
          forecastTemp.innerText =
            "Temp: " + res.data.list[forecastIndex].main.temp + " °F";
          fiveDay[i].append(forecastTemp);
          let forecastHumidity = document.createElement("p");
          forecastHumidity.innerText =
            "Humidity: " + res.data.list[forecastIndex].main.humidity + "%";
          fiveDay[i].append(forecastHumidity);
          let forecastWind = document.createElement("p");
          forecastWind.innerText =
            "Wind: " + res.data.list[forecastIndex].wind.speed + " mph";
          fiveDay[i].append(forecastWind);
        }
      });
    });
  }

  //   Get history from local storage if any
  searchEl.addEventListener("click", function () {
    const searchTerm = cityEl.value;
    cityEl.value = ``;
    if (searchTerm === ``) {
      window.location.replace("./index.html");
      // alert(`The input it's empty`);
    } else {
      getWeatherData(searchTerm);
      savedSearchHistory.push(searchTerm);
      localStorage.setItem("search", JSON.stringify(savedSearchHistory));
      renderSearchHistory();
    }
  });

  //   Clear History button
  clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
  });

  function renderSearchHistory() {
    history.innerHTML = "";
    for (let i = 0; i < savedSearchHistory.length; i++) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute(
        "class",
        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      );
      historyItem.setAttribute("value", savedSearchHistory[i]);
      historyItem.addEventListener("click", function () {
        getWeatherData(historyItem.value);
      });
      history.append(historyItem);
    }
  }

  renderSearchHistory();
  if (savedSearchHistory.length > 0) {
    getWeatherData(savedSearchHistory[savedSearchHistory.length - 1]);
  }
}

weatherApp();

// ---------------------------
// SeatGeek API
// ---------------------------

// Cards Const
const resultSection = document.querySelector(`.result-section`);
const cardsContainer = document.querySelector(`.cards-container`);
let firstSearch = false;

// API Client ID
const clientId = `Mjg2MTA4MDN8MTY2MTIxMjIzMS41NDk3NjAz`;

// Functions
// Local events, it's the function default, this function runs when the app it's open and it search events on your location.

function localEvents() {
  // Calling the API
  fetch(
    `https://api.seatgeek.com/2/events?geoip=true&client_id=${clientId}&per_page=50&page=3&sort=score.desc`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Function for create and display the cards on the screen
      cardsDisplay(data);
    });
}

localEvents();

function cardsDisplay(data) {
  for (let i = 0; i < 9; i++) {
    //Create Elements
    const card = document.createElement(`div`);
    const cardImg = document.createElement(`div`);
    const img = document.createElement(`img`);
    const cardInfo = document.createElement(`div`);
    const textTitle = document.createElement(`p`);
    const cardTextInfo = document.createElement(`div`);
    const textBody = document.createElement(`p`);
    const textDate = document.createElement(`p`);
    const cardFooter = document.createElement(`div`);
    const textPrice = document.createElement(`span`);
    const cardLocation = document.createElement(`div`);
    const textState = document.createElement(`span`);
    const textAddress = document.createElement(`span`);

    // Adding Classes
    card.classList.add(
      `card`,
      `bg-contain`,
      `bg-yellow-500`,
      `flex`,
      `content-center`,
      `flex-col`,
      `m-6`,
      `w-90`,
      `h-fit`,
      `rounded`,
      `font-medium`
    );
    cardImg.classList.add(`card-img`, `w-fit`, `h-fit`);
    img.classList.add(
      `img`,
      `rounded-t-lg`,
      `w-full`,
      `object-cover`,
      `w-fit`,
      `h-fit`
    );
    cardInfo.classList.add(`card-info`);
    textTitle.classList.add(`text-title`);
    cardTextInfo.classList.add(`card-text_info`);
    textBody.classList.add(`text-body`);
    textDate.classList.add(`text-date`);
    cardFooter.classList.add(`card-footer`);
    textPrice.classList.add(`text-title`, `text-price`);
    cardLocation.classList.add(`card-location`);
    textState.classList.add(`text-title`, `text-state`, `flex`);
    textAddress.classList.add(`text-address`);

    // appendChild
    cardsContainer.appendChild(card);
    // resultSection.appendChild(card);
    card.appendChild(cardImg);
    cardImg.appendChild(img);
    card.appendChild(cardInfo);
    cardInfo.appendChild(textTitle);
    cardInfo.appendChild(cardTextInfo);
    cardTextInfo.appendChild(textBody);
    cardTextInfo.appendChild(textDate);
    card.appendChild(cardFooter);
    cardFooter.appendChild(textPrice);
    cardFooter.appendChild(cardLocation);
    cardLocation.appendChild(textState);
    cardLocation.appendChild(textAddress);

    // Printing Data
    // Img
    img.src = data.events[i].performers[0].image;

    // Title
    textTitle.innerText = data.events[i].performers[0].short_name;

    // Text Info
    textPrice.innerText = `$ ${data.events[i].stats.lowest_price}`;
    textBody.innerText = data.events[i].taxonomies[0].name;
    textDate.innerText = data.events[i].datetime_local;

    // Text Price & Location
    textState.innerText = data.events[i].venue.display_location;
    textAddress.innerText = data.events[i].venue.address;
  }
}
