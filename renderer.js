setInterval(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    const timeString = `${hours}:${minutes}:${seconds}`

    document.getElementById("time").textContent = timeString
    console.log('time')
  }, 1000);

window.api.invoke('get-location').then((location) => {
    console.log('location', location)
    document.getElementById('city').innerHTML = location.city
    setTimeout(() => {
        getWeather(location)
        setInterval(() => {
            getWeather(location)
        }, 60000)
    }, 1000);
})

function getWeather(location){
    window.api.invoke('get-weather', location).then((result) => {
        console.log('weather', result)
        document.getElementById('temperature').innerHTML = result.properties.timeseries[0].data.instant.details.air_temperature
        document.getElementById('wind').innerHTML = result.properties.timeseries[0].data.instant.details.wind_speed
        document.getElementById('humidity').innerHTML = result.properties.timeseries[0].data.instant.details.relative_humidity
    })
}