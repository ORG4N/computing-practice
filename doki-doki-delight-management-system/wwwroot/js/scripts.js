
$(document).ready(function () {

    $(function () {
        $("#sidebar-placeholder").load('html/nav.html');
    });

    // If user clicks the sidebar home button, send back to front page
    $(document).on("click", "#homeButton", function () {

        var element = document.querySelector('.staffbar');

        if (document.contains(element)) {
            element.classList.add('animate__animated', 'animate__slideOutLeft');
        }

        else {
            element = document.querySelector('#page');
            element.classList.add('animate__animated', 'animate__slideOutRight');           // add an animation to the index div 
        }

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            $('main').load('index.html');
        });
    });


    // If user clicks the frontpage continue button take them to user selection
    $(document).on("click", "#continueButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');           // add an animation to the index div

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            $('main').load('html/userselect.html');
        });
    });


    // If user clicks the button to say theyre a customer, take them to reservation booking page
    $(document).on("click", "#customerButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/reservation.html');
        });
    });

    // If user clicks the button to say theyre an employee, take them to the sign in page
    $(document).on("click", "#employeeButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/signIn.html');
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
            var valid = formValidate();

            if (valid == true) {

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

                sessionStorage.setItem("userID", "Retrieving...");
                sessionStorage.setItem("forename", customer.forename);
                sessionStorage.setItem("surname", customer.surname);
                sessionStorage.setItem("email", customer.email);
                sessionStorage.setItem("tel", customer.tel);

                sessionStorage.setItem("bookingID", "Retrieving...");
                sessionStorage.setItem("occupants", reservation.occupants);
                sessionStorage.setItem("date", reservation.date);
                sessionStorage.setItem("time", reservation.time);

                postUsers(customer);
                postBookings(reservation);

                getUserID();
                $('main').load('html/confirmation.html');
            };
        };
    });

    // If user clicks the button to say theyre an employee, take them to the sign in page
    $(document).on("click", "#signInButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight', 'animate__faster');

        const element2 = document.querySelector('#navhtml');
        element2.classList.remove("animate__animated", "animate__slideInLeft", "animate__slower");
        element2.classList.add('animate__animated', 'animate__slideOutLeft', 'animate__faster');

        const element3 = document.querySelector('footer');
        if (document.contains(element3)) {
            element3.classList.add('animate__animated', 'animate__slideOutDown', 'animate__faster');
        };

        const element4 = document.querySelector('header');
        if (document.contains(element4)) {
            element4.classList.add('animate__animated', 'animate__slideOutUp', 'animate__faster');
        };

        element2.addEventListener('animationend', () => {
            $('#sidebar-placeholder').load('html/staff/sidebar.html');
            $('main').load('html/staff/bookings.html', function () {
                $("footer").remove();
                $("header").remove();
                fetchBookings();
            });
        });
    });

    $(document).on("click", "#removeBookingButton", function (e) {

        e.preventDefault();
        const element = document.getElementById("removeBookingButton");

        if (element.classList.contains("disabled")) {
            alert("Please wait!");
        }

        else {
            const customerID = document.getElementById("inputCustomerID").value;
            const bookingID = document.getElementById("inputReservationID").value;

            $.ajax({
                url: "https://localhost:44375/api/bookings",
                type: "GET",
                success: function (result) {

                    result.forEach(function (array) {
                        if (array.userID == customerID) {
                            if (array.bookingID == bookingID) {
                                deleteReservation(bookingID);
                            }
                        }
                    });
                }
            });
        }
    });

    $(document).on("click", "#viewBookings", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/bookings.html', function () {
                fetchBookings();
            });
        });
    });

    $(document).on("click", "#addBooking", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/addBooking.html');
        });
    });

    $(document).on("click", "#removeBooking", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/removeBooking.html');
        });
    });

    $(document).on("click", ".customer-id-click", function () {

        $.when(fetchUsers()).done(function(){

            var fields = ["forename", "surname", "tel", "email", "role", "id"];

            for (var i = 0; i < fields.length; i++) {

                input = document.getElementById(fields[i]);
                var name = "booking-customer-" + fields[i];
                var item = sessionStorage.getItem(name);
                input.innerHTML = item;
            }

            $(document.getElementById("id")).wrapInner("<b></b>");
        });
    });
});

function getCustomer() {

    var i;
    var fields = ["forename", "surname", "email", "tel", "userID"];

    for (i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).innerHTML = sessionStorage.getItem(fields[i]);
    }
}

async function deleteReservation(id) {
    const url = "https://localhost:44375/api/bookings/";

    try {
        await fetch(url + id, {
            method: "DELETE",
        });

    } catch (e) {
        throw "Failed to delete";
    }
}

function getUserID() {
    $.ajax({
        url: "https://localhost:44375/api/users",
        type: "GET",
        success: function (result) {

            result.forEach(function (array) {
                if (array.forename == sessionStorage.getItem("forename")) {
                    if (array.surname == sessionStorage.getItem("surname")) {
                        if (array.email == sessionStorage.getItem("email")) {
                            if (array.tel == sessionStorage.getItem("tel")) {
                                sessionStorage.setItem("userID", array.userID);
                                console.log(sessionStorage.getItem("userID"));
                            }
                        }
                    }
                }
                document.getElementById("userID").innerHTML = sessionStorage.getItem("userID");
                getBookingID();
            });
        }
    });
}

function getBooking() {

    var i;
    var fields = ["date", "time", "occupants", "bookingID",];

    for (i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).innerHTML = sessionStorage.getItem(fields[i]);
    }
}

function getBookingID() {
    $.ajax({
        url: "https://localhost:44375/api/bookings",
        type: "GET",
        success: function (result) {

            result.forEach(function (array) {
                if (array.userID == sessionStorage.getItem("userID")) {
                    sessionStorage.setItem("bookingID", array.bookingID);
                }
            });
            document.getElementById("bookingID").innerHTML = sessionStorage.getItem("bookingID");
        }
    });
}


async function fetchUsers() {

    const url = "https://localhost:44375/api/users";
    const raw = await fetch(url);

    const data = await raw.json();

    //role, forename, surname, email, tel 

    data.forEach(function (array) {
        if (array.userID == sessionStorage.getItem("booking-customer-id")) {

            sessionStorage.setItem("booking-customer-role", array.role);
            sessionStorage.setItem("booking-customer-forename", array.forename);
            sessionStorage.setItem("booking-customer-surname", array.surname);
            sessionStorage.setItem("booking-customer-email", array.email);
            sessionStorage.setItem("booking-customer-tel", array.tel);

            console.log(sessionStorage.getItem("booking-customer-id"));
            console.log(sessionStorage.getItem("booking-customer-role"));
            console.log(sessionStorage.getItem("booking-customer-forename"));
            console.log(sessionStorage.getItem("booking-customer-surname"));
            console.log(sessionStorage.getItem("booking-customer-email"));
            console.log(sessionStorage.getItem("booking-customer-tel"));

        }
    });

}

async function fetchBookings() {

    const url = "https://localhost:44375/api/bookings";
    const raw = await fetch(url);

    const data = await raw.json();

    $("#bookings tbody tr").remove();

    data.forEach(({bookingID, userID, date, time, occupants}) => {
        $("#bookings").find('tbody').append(`<tr><td>${bookingID}</td><td>${userID}</td><td>${date}</td><td>${time}</td><td>${occupants}</td></tr>`);
    });

    var length = document.getElementById("bookings").rows.length;
    document.getElementById("reservation-count-num").innerHTML = length;

    addLinks();
}

function addLinks() {

    const table = document.getElementById("bookings");
    var numRows = table.rows.length;

    for (var i = 0; i < numRows; i++) {

        var id = table.rows[i].cells[1];

        $(id).wrapInner("<a href='#' class='customer-id-click' onclick='setSearchID(this.id)'" + `id='field-${i}'` + " data-toggle='modal' data-target='#customer-info-modal'></a>");
    }

}

function setSearchID(id) {

    var customer = document.getElementById(id).innerHTML;

    sessionStorage.setItem("booking-customer-id", customer);
}

async function postUsers(data) {
    const url = "https://localhost:44375/api/users";

    try {
        await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((result) =>
        {
            getUserID();
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

function checkDate(){
    var date = document.getElementById("inputDate").value;
    
    // make border green
    if(date==""){
        $(document.getElementById("inputDate")).css("border","1px solid #dc3545");
    }

    // make border red
    else if(date!=""){
        $(document.getElementById("inputDate")).css("border",  "1px solid #28a745");
    }
}