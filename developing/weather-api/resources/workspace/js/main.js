/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/24/2022
? @document-modified:      03/26/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This program handles the main Weather Dashboard logic.

* Technologies used:
    - jQuery
    - openweathermap API
    - Google Fonts API
    - mah brain

* openweatherapp API key:
    - 594655f7cc53f85edac45ab1fd9d4a8a

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Cache recent search results?
-   Add more user-friendly behavior to search bar (do stuff on focus/focus lost)

==================================================================================================================================
*/

/* ---------------- */
/* Import Libraries */
/* ---------------- */
import datastore from "../../../../../tools/api/general/js/datastore-1.0.0.js";
import gutil from "../../../../../tools/api/general/js/gutil-1.0.0.js";

/* ------------------------- */
/* Global Element References */
/* ------------------------- */
// Initialize HTML element refs
let searchFieldEl;
let searchDropDownEl;
let searchDropDownResultsEl;

let currentWeatherDisplayEl;
let weatherHeaderEl;
let weatherDataEl;
let currentTimeEl;

let weatherCardContainerEl;

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */

// keep reference to the current global time (updated onClickTick, or every second)
let globalCurrentTime;
let currentTimezone;
// let lastSearchInput;

// create localstorage datakey name(s)
const datakeys = datastore.datakeys;
datakeys.searchHistory = "weatherdash:search-history";

// configurable search settings
const searchSettings = {
    historyLength: 10, // maximum number of search results that will be saved
    defaultCountry: "US", // if no country input is given, default to US
    searchHistory: datastore.get(datakeys.searchHistory, []),

    // responsive messages
    loadingMessage: "Searching",
    errorMessage: "Invalid entry",
    defaultMessage: "City, State, Country",
    nullRequestMessage: "Could not find location"
}

// store api data
const apis = {
    "openweathermap": {
        root: "https://api.openweathermap.org/data/2.5/",
        apiKey: "&appid=594655f7cc53f85edac45ab1fd9d4a8a",
        default: "&units=imperial",

        getImgUrl(iconId) {
            return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
        }
    }
}

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */
async function getAPIRequest(apiName, query) {
    const api = apis[apiName];
    const response = await fetch(api.root + query + api.default + api.apiKey);
    const data = await response.json();
    return data;
}

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */

// load initial element refs
function loadHTMLElements() {
    // search field elements
    searchFieldEl = $("#search-field");
    searchDropDownEl = $("#search-drop-down");
    searchDropDownResultsEl = $("#search-drop-down .scroll");

    // current weather display elements
    currentWeatherDisplayEl = $("#current-weather-display");
    weatherHeaderEl = $(currentWeatherDisplayEl).children(".weather-header");
    weatherDataEl = $(currentWeatherDisplayEl).children(".weather-data");
    currentTimeEl = $(weatherHeaderEl).children("p");

    weatherCardContainerEl = $("#weather-card-container");
}

// update current-day local weather 
function updateCurrentWeatherCard(weatherData) {
    const weatherIconEl = $(weatherHeaderEl).children(".weather-icon");
    const cityNameEl = $(weatherHeaderEl).children("h2");
    const tempEl = $("#current-temp");
    const windSpeedEl = $("#current-wind");
    const uviEl = $("#current-uvi");
    const humidityEl = $("#current-humid");

    $(weatherIconEl).attr("src", apis.openweathermap.getImgUrl(weatherData.icon));
    $(cityNameEl).text(weatherData.cityName);
    $(tempEl).text(weatherData.temp);
    $(windSpeedEl).text(weatherData.windSpeed);
    $(uviEl).text(weatherData.uvi);
    $(uviEl).css("color", calcUVIndexColor(weatherData.uvi));
    $(humidityEl).text(weatherData.humidity);

    $(currentWeatherDisplayEl).addClass("fade-in");
}

// create weather forecast card
function createWeatherCard(weatherData) {
    // construct weather card
    const weatherCardEl = $("<div class=\"weather-card\">");
    const weatherCardHeadEl = $("<div class=\"cent-all-hz\">");
    const forecastDateEl = $("<h3>");
    const forecastIconEl = $("<img class=\"weather-icon\">");
    const weatherCardBodyEl = $("<div class=\"weather-data\">");

    const sec1 = $("<div>");
    const sec2 = $("<div>");
    const sec3 = $("<div>");

    const tempEl = $("<p>");
    const windSpeedEl = $("<p>");
    const humidEl = $("<p>");

    // display data settings to elements
    $(tempEl).text(weatherData.temp);
    $(windSpeedEl).text(weatherData.windSpeed);
    $(humidEl).text(weatherData.humidity);
    $(forecastIconEl).attr("src", apis.openweathermap.getImgUrl(weatherData.icon));
    $(forecastDateEl).text(weatherData.date.toLocaleDateString());
    $(forecastIconEl).css("background-color", "#cccccc");

    // append elements to weather card body
    $(sec1).append("<p>Temperature:</p>").append(tempEl);
    $(sec2).append("<p>Wind Speed:</p>").append(windSpeedEl);
    $(sec3).append("<p>Humidity:</p>").append(humidEl);

    $(weatherCardBodyEl).append(sec1);
    $(weatherCardBodyEl).append(sec2);
    $(weatherCardBodyEl).append(sec3);

    // append elements to weather card header
    $(weatherCardHeadEl).append(forecastIconEl);
    $(weatherCardHeadEl).append(forecastDateEl);

    // append both main sub-containers to primary container
    $(weatherCardEl).append(weatherCardHeadEl);
    $(weatherCardEl).append(weatherCardBodyEl);

    // return weather card
    return weatherCardEl;
}

// generate weather forecast cards
function generateWeatherCards(weatherData) {
    $(weatherCardContainerEl).empty(); // clear old weather cards
    const cards = [];

    // create cards
    for (let index = 1; index < 6; index++) {
        const weatherCardEl = createWeatherCard(weatherData[index]);
        $(weatherCardContainerEl).append(weatherCardEl);
        cards[index] = weatherCardEl;
    };

    // animate cards to fade-in
    gutil.forInterval(0, cards.length, 1, 500, index => {
        $(cards[index]).addClass("fade-in");
    })
}

// generate search result buttons
function loadSearchHistory() {
    $(searchDropDownResultsEl).empty(); // clear search result buttons

    // retrieve search history
    const resultData = datastore.get(datakeys.searchHistory, []);

    // default if no previous search results exist
    if (resultData.length === 0) {
        resultData[0] = {
            id: "No previous search results yet"
        }
    }

    // traverse search history and generate search result buttons
    for (let index = 0; index < resultData.length; index++) {
        const result = resultData[index];
        const buttonEl = $(`<button>${result.id}</button>`);

        $(buttonEl).addClass("search-result-button");
        $(searchDropDownResultsEl).append(buttonEl);
    }
}

// make-shift uvi color converter
function calcUVIndexColor(uvi) {
    // colors to transition between (green being a safe uvi, red being bad)
    const c_i = {r: 0, g: 255, b: 0};    // color initial
    const c_f = {r: 255, g: 0, b: 0};  // color final

    const scale = uvi/7; // magic number 7 for big uvi
    const inv = (1 - scale);

    // oof, maybe make a tweening library soon...
    const prod = {
        r: c_i.r*inv + c_f.r*scale,
        g: c_i.g*inv + c_f.g*scale,
        b: c_i.b*inv + c_f.b*scale
    }

    return `rgb(${prod.r}, ${prod.g}, ${prod.b})`;
}

function getFormattedWeatherStats(temp, windSpeed, humidity) {
    return [temp + "°F", windSpeed + "mph", humidity + "%"];
}

// get formatted daily forecast data
function getDailyForecastData(forecastData) {
    const dailyForecast = [];

    for (let index = 0; index < forecastData.daily.length; index++) {
        const dayWeather = forecastData.daily[index];

        // format weather data in degrees, mph, and %
        const [temp, windSpeed, humidity] = getFormattedWeatherStats(
            dayWeather.temp.day,
            dayWeather.wind_speed,
            dayWeather.humidity
        );

        dailyForecast[index] = {
            date: new Date(dayWeather.dt*1000),
            temp: temp,
            windSpeed: windSpeed,
            humidity: humidity,
            icon: dayWeather.weather[0].icon
        }
    }

    return dailyForecast;
}

// save recent search result to local storage
function addSearchQueryToHistory(searchData) {
    datastore.update(datakeys.searchHistory, data => {
        // if new search data is the same as the most recent, don't update
        if (data.length > 0 && data[0].id === searchData.id) return data;

        // update search history
        data.unshift(searchData);
        if (data.length > searchSettings.historyLength) data.pop();
        return data;
    });
}

// process search request
function processSearchQuery(input, addToHistory=true) {

    // parse search request for 'CityName, StateName'
    // const searchQuery = /(\w+)\s*,\s*(\w+),?\s*(\w*)/.exec(input.trim());
    const searchQuery = /([^,]+),\s*([^,]+),?\s*(\w*)/.exec(input.trim()); // regex search filter

    // if search query is invalid then exit
    if (!searchQuery) {
        $(searchFieldEl).attr("placeholder", searchSettings.errorMessage).val("");
        $(searchFieldEl).focus();
        return;
    }

    // reset placeholder to default
    $(searchFieldEl).attr("placeholder", searchSettings.defaultMessage);
    let [searchInput, queryCity, queryState, queryCountry] = searchQuery;
    [queryCity, queryState, queryCountry] = [queryCity.trim(), queryState.trim(), queryCountry.trim()]; // remove unnecessary spaces

    // select default country if none is defined
    queryCountry = queryCountry || searchSettings.defaultCountry;

    // make async request to openweathermap for initial weather and location data
    const weatherLocationRequest = getAPIRequest(
        "openweathermap", 
        `weather?q=${queryCity},${queryState},${queryCountry}`
    );

    // loading animation on search bar
    const waitInterval = gutil.whileInterval(2, 1, 500, num => {
        $(searchFieldEl).val(searchSettings.loadingMessage + ([".", "..", "..."])[num%3]);
    });

    // cancel load animation when necessary
    function cancelLoadingAnim(message, refocus) {
        clearInterval(waitInterval);
        $(searchFieldEl).val(message || "");
        if (refocus) $(searchFieldEl).focus();
    }

    // local weather data JSON parsing callback
    weatherLocationRequest.then(localWeather => {

        // if location doesn't exist, handle error
        if (localWeather.cod === "404") {
            $(searchFieldEl).attr("placeholder", searchSettings.nullRequestMessage);
            setTimeout(() => cancelLoadingAnim(null, true), 1000);
            return;
        }

        // re-format local weather data
        // commented-out fields are added later on (below) before object is used
        const localWeatherData = {
            // icon: localWeather.weather[0].icon,
            // windSpeed: ~~localWeather.wind.speed,
            // temp: ~~localWeather.main.temp,
            cityName: localWeather.name,
            countryName: localWeather.sys.country,
            // humidity: localWeather.main.humidity
        };

        // make second request for forecast
        const forecastRequest = getAPIRequest(
            "openweathermap",
            `onecall?lat=${localWeather.coord.lat}&lon=${localWeather.coord.lon}&exclude=hourly,minutely`
        )

        // second weather api request (for getting daily forecasts)
        forecastRequest.then(forecastData => {
            // add uv index to localWeatherData before updating the local weather
            localWeatherData.uvi = forecastData.current.uvi;
            localWeatherData.icon = forecastData.current.weather[0].icon;
            localWeatherData.timezone = forecastData.timezone.replaceAll("_", " ");

            console.log("uv color:", calcUVIndexColor(localWeatherData.uvi));

            // update timezone data
            currentTimezone = localWeatherData.timezone;
            onClockTick();

            // format weather data with degrees, mph, and %
            [
                localWeatherData.temp, 
                localWeatherData.windSpeed,
                localWeatherData.humidity
            ] = getFormattedWeatherStats(
                forecastData.current.temp,
                forecastData.current.wind_speed,
                forecastData.current.humidity
            );
            
            // update current weather & 5-day forecast weather
            updateCurrentWeatherCard(localWeatherData);
            generateWeatherCards(getDailyForecastData(forecastData));

            // stop animation for initial request 
            const searchId = `${localWeatherData.cityName}, ${queryState}, ${localWeatherData.countryName}`;
            cancelLoadingAnim(searchId);

            // add search results to history
            if (addToHistory) {
                addSearchQueryToHistory({
                    id: searchId,
                    cityName: localWeatherData.cityName,
                    stateName: queryState,
                    countryName: localWeatherData.countryName
                });
            }
        });

    });
}

/* ------------------------ */
/* Event Callback Functions */
/* ------------------------ */

function onSearchResultClicked(event) {
    const target = event.target;

    if ($(target).hasClass("search-result-button")) {
        processSearchQuery($(searchFieldEl).val($(target).text()).val(), false);
    }
}

function onSearchQuery(event) {
    if (event.keyCode != 13) return; // if the user presses enter, continue

    // unfocus the search field
    $(searchFieldEl).blur();
    processSearchQuery($(searchFieldEl).val());
}

function onSearchFocus(event) {
    $(searchDropDownEl).show();
    $(searchFieldEl).val("");
    loadSearchHistory();
}

function onSearchFocusLost(event) {
    $(searchDropDownEl).hide();
}

function onClockTick() {
    const currentTime = new Date();
    globalCurrentTime = currentTime;
    $(currentTimeEl).text(currentTime.toLocaleString() + (currentTimezone ? ` (${currentTimezone})` : ""));
}

// initiate program
// this function should only run once
function init() {
    // assign global elements
    loadHTMLElements();

    // immediately update global time
    onClockTick();

    // show user a test search
    processSearchQuery("Raleigh, NC, US", false);

    // start clock tick event
    setInterval(onClockTick, 1000);

    // connect event listeners
    $(searchDropDownEl).on("mousedown", onSearchResultClicked);
    $(searchFieldEl).focusout(onSearchFocusLost);
    $(searchFieldEl).focus(onSearchFocus);
    $(searchFieldEl).keyup(onSearchQuery);
}

/* ---------------------------------- */
/* Initiate Program on Document Ready */
/* ---------------------------------- */
$(() => init()) // init program when document is ready


