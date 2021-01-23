
$(document).ready(function () {

    $(function(){
        $("#sidebar-placeholder").load('nav.html');
    });

    // If user clicks the sidebar home button, send back to front page
    $(document).on("click","#homeButton",function(){
        const element = document.querySelector('#page');
        element.classList.add('animate__animated','animate__slideOutRight');           // add an animation to the index div

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            loadDoc('home');
        });
    });


    // If user clicks the frontpage continue button take them to user selection
    $(document).on("click","#continueButton",function(){

        const element = document.querySelector('#page');
        element.classList.add('animate__animated','animate__slideOutRight');           // add an animation to the index div

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            loadDoc('userselect');
        });
    });


    // If user clicks the button to say theyre a customer, take them to reservation booking page
    $(document).on("click","#customerButton",function(){

        const element = document.querySelector('#page');
        element.classList.add('animate__animated','animate__slideOutRight');

        element.addEventListener('animationend', () => {
            loadDoc('reservation');
        });
    });

    // If user clicks the button to say theyre an employee, take them to the sign in page
    $(document).on("click","#employeeButton",function(){

        const element = document.querySelector('#page');
        element.classList.add('animate__animated','animate__slideOutRight');

        element.addEventListener('animationend', () => {
            loadDoc('signIn');

        });
    });

    // If user clicks this button then clear all input form data
    $(document).on("click","#clearButton",function(){

        document.querySelector('form').reset();

    });

    // If user clciks this button then submit the booking details for validation
    $(document).on("click","#reservationButton",function(){

        formValidate();
        console.log("button pressed");

    });
});

// Function for loading different html files
function loadDoc(page){

    if (page=='home'){$('main').load('index.html');}            // Load the Home page

    else if (page=='userselect'){$('main').load('userselect.html');}        // Load the User Select page

    else if (page=='reservation'){$('main').load('reservation.html');}   // Load the Reservation page

    else if (page=='signIn'){$('main').load('signIn.html');}        // Load the Employee Sign In page
}

function formValidate(){

    var fields = ["inputForename", "inputSurname", "inputTel", "inputEmail", "inputOccupants", "inputDate", "inputTime"];
    var input;

    for (var i=0; i<fields.length; i++){

        input = document.getElementById(fields[i]);

        if(input.value=="" || input.value=="null"){
            input.validationMessage;
            console.log("Empty input:", fields[i]);
        }

        if(!input.checkValidity()){
            input.validationMessage;
            console.log("Invalid input:", fields[i]);
        }
        
        else{
            reservation.submit();
        }

    }
}