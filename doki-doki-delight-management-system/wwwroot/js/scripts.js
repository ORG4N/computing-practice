$(document).ready(function () {

    /*  This code will be executed when the 'document' has been fully loaded.
        Currently, all it does is load the nav html file into a div placeholder. 
    */

    $(function () {
        $("#sidebar-placeholder").load('html/nav.html');
    });


    /*  The next bunch of functions use Jquery to load new html content into the page
        and remove the current content. I apply animations to the current page to 
        displace it off-screen, and then seamlessly load in the new content.

        I have commented the first example of a button press to change the site's content
        to document the structure of each process - they are relatively the same.

        P.S. animations are done using a css library: animate.css
    */

    // If user clicks the sidebar home button, send back to front page
    $(document).on("click", "#homeButton", function () {

        // If the user is on the staff dashboard page then the staffbar will animate out to the left
        var element = document.querySelector('.staffbar');
        if (document.contains(element)) {
            element.classList.add('animate__animated', 'animate__slideOutLeft');
        }

        // Otherwise, the user must be on the customer portion of the site, and the page will need to be displaced
        else {
            element = document.querySelector('#page');
            element.classList.add('animate__animated', 'animate__slideOutRight');
        }

        // Wait for animations to end and then load in the new content using Jquery
        element.addEventListener('animationend', () => {
            $('main').load('index.html');
        });
    });


    // If user clicks the frontpage continue button take them to user selection
    $(document).on("click", "#continueButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/userselect.html');
        });
    });


    // If user clicks customer selection button, send to reservation creation page
    $(document).on("click", "#customerButton", function () {

        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/reservation.html');
        });
    });

    // If user clicks the employee selection button, take them to the sign in page
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

        // Stops the page from refreshing (unwanted behaviour in a single page app)
        e.preventDefault();

        /*  If the form submission is valid then the button will be disabled so that multiple reservations are not 
            accidentally made as this could potentially disrupt the web services.    */
        const element = document.getElementById("reservationButton");
        if (element.classList.contains("disabled")) {
            alert("Please wait!");
        }

        else {
            // Custom function that will check for specific characteristics of the inputs (currently checks if empty)
            var valid = formValidate();

            if (valid == true) {

                // Disable the button
                element.classList.add("disabled");


                /*  1. Creates two objects and stores the form data witin them  
                    2. Stores them within temporary session storage
                    3. Posts the data to the asp.net web API (stores into file)
                    4. Fetches the unique ID that the web api generates for each user
                    5. Loads the confirmation html page that relays the information back to the user 
                */

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
                };;

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

    // If user clicks this button, their inputs will be verified and they will be given access to the staff dashboard
    $(document).on("click", "#signInButton", function () {

        // Animate out the main page content
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight', 'animate__faster');

        // Animate out the navbar
        const element2 = document.querySelector('#navhtml');
        element2.classList.remove("animate__animated", "animate__slideInLeft", "animate__slower");
        element2.classList.add('animate__animated', 'animate__slideOutLeft', 'animate__faster');

        // Animate out the header and footer decorative bars
        const element3 = document.querySelector('footer');
        if (document.contains(element3)) {
            element3.classList.add('animate__animated', 'animate__slideOutDown', 'animate__faster');
        };

        const element4 = document.querySelector('header');
        if (document.contains(element4)) {
            element4.classList.add('animate__animated', 'animate__slideOutUp', 'animate__faster');
        };

        // Loads the sidebar and the bookings table whilst fully removing the decorative footer/header
        element2.addEventListener('animationend', () => {
            $('#sidebar-placeholder').load('html/staff/sidebar.html');
            $('main').load('html/staff/bookings.html', function () {
                $("footer").remove();
                $("header").remove();

                // Fetches all the bookings and dynamically writes them to the screen in table format
                fetchBookings();
            });
        });
    });

    // This button is used for searching for a booking by comparing an input customer ID and booking ID to the web api.
    // Reused for both amend booking and delete booking functionalities
    $(document).on("click", "#searchBookingButton", function (e) {

        // Take values from the input fields
        const customerID = document.getElementById("inputCustomerID").value;
        const bookingID = document.getElementById("inputReservationID").value;

        // Using Jquery, interface with the web api and compare the inputs to existing bookings
        $.ajax({
            url: "https://localhost:44375/api/bookings",
            type: "GET",
            success: function (result) {

                result.forEach(function (array) {
                    if (array.userID == customerID) {           // Find an existing user - depending on the input
                        if (array.bookingID == bookingID) {     // See if that user's bookings correlates to the input booking ID

                            sessionStorage.setItem("booking-customer-id", customerID);

                            // Using values from the matching web api booking, write them to the screen via innerHTML
                            document.getElementById("booking-id").innerHTML = array.bookingID;
                            document.getElementById("date").innerHTML = array.date;
                            document.getElementById("time").innerHTML = array.time;
                            document.getElementById("occupants").innerHTML = array.occupants;

                            // Only execute the following code once the fetchUsers() function has completed
                            // This function fetches the user corresponding to the booking id and stores their info in session storage
                            $.when(fetchUsers()).done(function () {

                                // Delete booking functionality displays role whilst amend booking doesn't and therefore the arrays are different
                                var fields = ["forename", "surname", "tel", "email", "role", "id"];

                                if (document.getElementById("amendBookingButton") != null) {
                                    fields = ["forename", "surname", "tel", "email", "id"]
                                }

                                // Using the array of id's it takes the corresonding data from session storage and writes it as inner html of the id div
                                for (var i = 0; i < fields.length; i++) {

                                    input = document.getElementById(fields[i]);
                                    var name = "booking-customer-" + fields[i];
                                    var item = sessionStorage.getItem(name);
                                    input.innerHTML = item;
                                }

                                // Make the ID's bold by wrapping them in <b> attribute 
                                $(document.getElementById("id")).wrapInner("<b></b>");
                                $(document.getElementById("booking-id")).wrapInner("<b></b>");

                            });
                        }

                        else {
                            alert("Reservation doesn't exist... Try again.");

                            var fields = ["forename", "surname", "tel", "email", "role", "id", "booking-id", "date", "time", "occupants"];

                            if (document.getElementById("amendBookingButton") != null) {
                                fields = ["forename", "surname", "tel", "email", "id", "booking-id", "date", "time", "occupants"];
                            }

                            for (var i = 0; i < fields.length; i++) {
                                document.getElementById(fields[i]).innerHTML = " ";
                            }
                        }
                    }

                    else {
                        alert("Invalid input... Try again.");

                        var fields = ["forename", "surname", "tel", "email", "role", "id", "booking-id", "date", "time", "occupants"];

                        if (document.getElementById("amendBookingButton") != null) {
                            fields = ["forename", "surname", "tel", "email", "id", "booking-id", "date", "time", "occupants"];
                        }

                        for (var i = 0; i < fields.length; i++) {
                            document.getElementById(fields[i]).innerHTML = " ";
                        }
                    }
                });
            }
        });

    });

    // This button is used to delete a booking based on two customer id and booking id inputs
    $(document).on("click", "#removeBookingButton", function (e) {

        e.preventDefault();

        const customerID = document.getElementById("inputCustomerID").value;
        const bookingID = document.getElementById("inputReservationID").value;

        $.ajax({
            url: "https://localhost:44375/api/bookings",
            type: "GET",
            success: function (result) {

                result.forEach(function (array) {
                    if (array.userID == customerID) {
                        if (array.bookingID == bookingID) {

                            // If the booking and customer id's correspond to an actual booking then delete the reservation
                            // by calling this function
                            deleteReservation(bookingID);
                        }
                    }
                });
            }
        });
        
    });

    // Staffbar navigation button - view all reservations in table format
    $(document).on("click", "#viewBookings", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/bookings.html', function () {
                fetchBookings(); // Fetches bookings from web api and writes them to a table
            });
        });
    });

    // Staffbar navigation button - access add reservations page
    $(document).on("click", "#addBooking", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/addBooking.html');
        });
    });

    // Staffbar navigation button - remove a specific reservation from the system
    $(document).on("click", "#removeBooking", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/removeBooking.html');
        });
    });

    // Staffbar navigation button - change a reservations details
    $(document).on("click", "#amendBooking", function () {
        const element = document.querySelector('#page');
        element.classList.add('animate__animated', 'animate__slideOutRight');

        element.addEventListener('animationend', () => {
            $('main').load('html/staff/amendBooking.html');
        });
    });

    // If the user clicks on the customer id of a booking on the bookings table (bookings.html)
    $(document).on("click", ".customer-id-click", function () {

        // Call the fetchUsers function and execute the following code once the function is done
        $.when(fetchUsers()).done(function(){

            var fields = ["forename", "surname", "tel", "email", "role", "id"];

            // Iterate through each of the id's above and change their inner htmls with the info fetched from the fetchUsers function
            for (var i = 0; i < fields.length; i++) {

                input = document.getElementById(fields[i]);
                var name = "booking-customer-" + fields[i];
                var item = sessionStorage.getItem(name);
                input.innerHTML = item;
            }

            $(document.getElementById("id")).wrapInner("<b></b>");
            sessionStorage.clear(); // Empty session storage

        });
    });
});

// Using each element within fields as an ID, iterate through them and change their inner html with whatever
// data is stored as the value of the id key  - called on the confirmation.html page
function getCustomer() {

    var i;
    var fields = ["forename", "surname", "email", "tel", "userID"];

    for (i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).innerHTML = sessionStorage.getItem(fields[i]);
    }
}


// The function is called with the booking id as a parameter, which is then sent to the web api and used to delete a reservation
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

// Used to fetch the ID immediately after creating a reservation - compares each value from a user object in the web api
// to the values within session storage
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
                            }
                        }
                    }
                }

                // Write the fetched user id to the screen
                document.getElementById("userID").innerHTML = sessionStorage.getItem("userID");

                // Use  the user id to then fetch the booking ID
                getBookingID();
            });
        }
    });
}

// Write the booking info to the screen - called on the confirmation.html page
function getBooking() {

    var i;
    var fields = ["date", "time", "occupants", "bookingID",];

    for (i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).innerHTML = sessionStorage.getItem(fields[i]);
    }
}

// Called from within the getUserID function - used to fetch the id corresponding to the user id
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

// Fetch a specific user from the api interface and store their details in storage
async function fetchUsers() {

    const url = "https://localhost:44375/api/users";
    const raw = await fetch(url);

    const data = await raw.json();

    data.forEach(function (array) {
        if (array.userID == sessionStorage.getItem("booking-customer-id")) {

            sessionStorage.setItem("booking-customer-role", array.role);
            sessionStorage.setItem("booking-customer-forename", array.forename);
            sessionStorage.setItem("booking-customer-surname", array.surname);
            sessionStorage.setItem("booking-customer-email", array.email);
            sessionStorage.setItem("booking-customer-tel", array.tel);
        }
    });

}

// Interfaces with the web api and then dynamically creates new records on the table
async function fetchBookings() {

    const url = "https://localhost:44375/api/bookings";
    const raw = await fetch(url);

    const data = await raw.json();

    $("#bookings tbody tr").remove();

    // Iterate through each booking on the interface and draws it to the screen
    data.forEach(({bookingID, userID, date, time, occupants}) => {
        $("#bookings").find('tbody').append(`<tr><td>${bookingID}</td><td>${userID}</td><td>${date}</td><td>${time}</td><td>${occupants}</td></tr>`);
    });

    // Write the total amount of bookings to the screen
    var length = document.getElementById("bookings").rows.length;
    document.getElementById("reservation-count-num").innerHTML = length;

    // Adds links to each customer id
    addLinks();
}

// Wraps each customer id in a hyperlink tag that is used to open a modal that has the users information written to it
function addLinks() {

    const table = document.getElementById("bookings");
    var numRows = table.rows.length;

    for (var i = 0; i < numRows; i++) {

        var id = table.rows[i].cells[1];

        $(id).wrapInner("<a href='#' class='customer-id-click' onclick='setSearchID(this.id)'" + `id='field-${i}'` + " data-toggle='modal' data-target='#customer-info-modal'></a>");
    }

}

// Set the customer id to a key within session storage
function setSearchID(id) {

    var customer = document.getElementById(id).innerHTML;

    sessionStorage.setItem("booking-customer-id", customer);
}

// When the user submits a reservation it is posted to the api interface and stored into a file
async function postUsers(data) {
    const url = "https://localhost:44375/api/users";

    try {
        await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((result) =>
        {
            getUserID();    // Once the post is finished then fetch the ID
        });

    } catch (e) {
        throw "Failed to post";
    }
}

// Post the booking information (instead of the user information) to the api
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

// checking whether the form submission is empty or doesnt follow javascript validations
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

// Round the value within the time input field to the nearest hour or half-hour
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

// Initialis the pikaday library for the date picker
// Also initialises flatpickr for the time picker
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

// Validation colours for the datepicker as pikaday isnt compatible with the automated javascript stuff
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