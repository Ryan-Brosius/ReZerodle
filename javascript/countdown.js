
var hoursEl = document.getElementById('hours')
var minutesEl = document.getElementById('minutes')
var secondsEl = document.getElementById('seconds')

function countdownTimer() {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth();
    let year = now.getFullYear();
    let nextDay = new Date(year, month, day + 1, 0, 0, 0, 0);

    const interval = setInterval(() =>{
        let now = new Date();

        now = new Date();
        day = now.getDate();
        month = now.getMonth();
        year = now.getFullYear();

        let difference = nextDay - now;

        let hours = Math.floor(difference / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);


        hoursEl.innerText = format(hours)
        minutesEl.innerText = format(minutes)
        secondsEl.innerText = format(seconds)
    }, 1000)
}

function format(number){
    if (number < 10){
        return '0' + number;
    }
    return number;
}

countdownTimer();