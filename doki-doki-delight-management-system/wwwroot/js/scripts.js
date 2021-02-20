
$(document).ready(function () {

    $(function () {
        $("#sidebar-placeholder").load('nav.html');
    });

    // If user clicks the sidebar home button, send back to front page
    $(document).on("click", "#homeButton", function () {

        var element = document.querySelector('.staffbar');

        if (document.contains(element)){
            element.classList.add('animate__animated', 'animate__slideOutLeft');
        }
        
        else{
            element = document.querySelector('#page');
            element.classList.add('animate__animated', 'animate__slideOutRight');           // add an animation to the index div 
        }

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            loadDoc('home');
        });
    });


    // If user clicks the frontpage continue button take them to user selection
    $(document).on("click", "#continueButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');           // add an animation to the index div

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            loadDoc('userselect');
        });
    });


    // If user clicks the button to say theyre a customer, take them to reservation booking page
    $(document).on("click", "#customerButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            loadDoc('reservation');
        });
    });

    // If user clicks the button to say theyre an employee, take them to the sign in page
    $(document).on("click", "#employeeButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            loadDoc('signIn');
        });
    });

    // If user clicks this button then clear all input form data
    $(document).on("click", "#clearButton", function () {

        document.querySelector('form').reset();

    });

    // If user clciks this button then submit the booking details for validation
    $(document).on("click", "#reservationButton", function (e) {

        e.preventDefault();
        const element = document.getElementById("reservationButton");

        if (element.classList.contains("disabled")) {
            alert("Please wait!");
        }

        else {
            var test = formValidate();

            if (test == true) {

                element.classList.add("disabled");

                var customer = {
                    "userID": "",
                    "role": "Customer",
                    "forename": (document.getElementById("inputForename").value),
                    "surname": (document.getElementById("inputSurname").value),
                    "email": (document.getElementById("inputEmail").value),
                    "tel": (document.getElementById("inputTel").value)
                };

                var reservation = {
                    "bookingID": "",
                    "userID": "",
                    "occupants": (document.getElementById("inputOccupants").value),
                    "date": (document.getElementById("inputDate").value),
                    "time": (document.getElementById("inputTime").value)
                };

                console.log(JSON.stringify(customer, undefined, 2));
                console.log(JSON.stringify(reservation, undefined, 2));

                postUsers(customer);
                postBookings(reservation);
            };
        };
    });
});

// If user clicks the button to say theyre an employee, take them to the sign in page
$(document).on("click", "#signInButton", function () {

    const element = document.querySelector('#page');
    element.classList.add('animate__animated', 'animate__slideOutRight', 'animate__faster');

    const element2 = document.querySelector('#navhtml');
    element2.classList.remove("animate__animated","animate__slideInLeft", "animate__slower");
    element2.classList.add('animate__animated', 'animate__slideOutLeft', 'animate__faster');

    const element3 = document.querySelector('footer');
    if (document.contains(element3)){
        element3.classList.add('animate__animated', 'animate__slideOutDown', 'animate__faster');
    };
    
    const element4 = document.querySelector('header');
    if (document.contains(element4)){
        element4.classList.add('animate__animated', 'animate__slideOutUp', 'animate__faster');
    };

    element2.addEventListener('animationend', () => {
        loadDoc('staff');
        fetchBookings();
    });
});

$(document).on("click", "#viewBookings", function () {
    const element = document.querySelector('#page');
    element.classList.add('animate__animated', 'animate__slideOutRight');

    element.addEventListener('animationend', () => {
        $('main').load('bookings.html');
        fetchBookings();
    });
});

$(document).on("click", "#addBooking", function () {
    const element = document.querySelector('#page');
    element.classList.add('animate__animated', 'animate__slideOutRight');

    element.addEventListener('animationend', () => {
        $('main').load('addBooking.html');
    });
});

async function fetchUsers() {

    const url = "https://localhost:44375/api/users";
    const raw = await fetch(url);

    const data = await raw.json();
    console.table(data);
}

async function fetchBookings() {

    const url = "https://localhost:44375/api/bookings";
    const raw = await fetch(url);

    const data = await raw.json();

    $("#bookings tbody tr").remove();

    data.forEach(({bookingID, userID, date, time, occupants}) => {
        $("#bookings").find('tbody').append(`<tr><td>${bookingID}</td><td>${userID}</td><td>${date}</td><td>${time}</td><td>${occupants}</td></tr>`);
    })    
}

async function postUsers(data) {
    const url = "https://localhost:44375/api/users";

    try {
        await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

    } catch (e) {
        throw "Failed to post";
    }
}

async function postBookings(data) {
    const url = "https://localhost:44375/api/bookings";

    try {
        await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

    } catch (e) {
        throw "Failed to post";
    }
}


// Function for loading different html files
function loadDoc(page) {

    if (page == 'home') { $('main').load('index.html'); }            // Load the Home page

    else if (page == 'userselect') { $('main').load('userselect.html'); }        // Load the User Select page

    else if (page == 'reservation') { $('main').load('reservation.html'); }   // Load the Reservation page

    else if (page == 'signIn') { $('main').load('signIn.html'); }        // Load the Employee Sign In page

    else if (page == 'staff') {
        $('#sidebar-placeholder').load('sidebar.html');
        $('main').load('bookings.html');
        $("footer").remove();
        $("header").remove();
    }
}

function formValidate() {

    var fields = ["inputForename", "inputSurname", "inputTel", "inputEmail", "inputOccupants", "inputDate", "inputTime"];
    var valid = true;
    var input;

    for (var i = 0; i < fields.length; i++) {

        input = document.getElementById(fields[i]);

        if (input.value == "" || input.value == "null") {
            input.validationMessage;
            console.log("Empty input:", fields[i]);
            valid = false;
        }

        if (!input.checkValidity()) {
            input.validationMessage;
            console.log("Invalid input:", fields[i]);
            valid = false
        }
    }

    return valid;
}

function checkTime(){

    var time = document.getElementById("inputTime").value;
    console.log(time);

    var split = time.split(":");
    var min = split[1];

    if (min < 15){ min = "00";}
    else if (min < 45){ min = "30";}
    else { min = "00";}

    time = split[0] + ":" + min;

    document.getElementById("inputTime").value = time;
}

function dateAndTime() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    var month = new Date();
    month = new Date(month.getFullYear(), month.getMonth() + 2, 0);

    var picker = new Pikaday({
        field: document.getElementById('inputDate'),
        format: 'DD-MM-YYYY',
        minDate: tomorrow,
        maxDate: month,
    });

    flatpickr(".selector", {});
    document.getElementById("inputTime").flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minTime: "09:00",
        maxTime: "17:00",
        position: "above right",
        minuteIncrement: "30",
        defaultHour: 9,
        defaultMinute: 0,
    });
}