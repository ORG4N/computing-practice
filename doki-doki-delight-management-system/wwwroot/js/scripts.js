$(document).ready(function () {


    // If user clicks the frontpage continue button take them to user selection
    $(document).one("click","#continueButton",function(){

        const element = document.querySelector('#index');
        element.classList.add('animate__animated','animate__slideOutRight');           // add an animation to the index div

        element.addEventListener('animationend', () => {                                // wait until animation ends and load new content
            console.log('Animation ended');
            loadDoc('userselect');
        });
    });


    // If user clicks the button to say theyre a customer, take them to reservation booking page
    $(document).one("click","#customerButton",function(){

        const element = document.querySelector('#userselect');
        element.classList.add('animate__animated','animate__slideOutRight');

        element.addEventListener('animationend', () => {
            console.log('Animation ended');
            loadDoc('reservation');
        });
    });

    // If user clicks the button to say theyre an employee, take them to the sign in page
    $(document).one("click","#employeeButton",function(){

        const element = document.querySelector('#userselect');
        element.classList.add('animate__animated','animate__slideOutRight');

        lelement.addEventListener('animationend', () => {
            console.log('Animation ended');
            loadDoc('signIn');
        });
    });
});

// Function for loading different html files
function loadDoc(page){

    if (page=='userselect')     {$('main').load('userselect.html');}        // Load the User Select page

    else if (page=='reservation'){$('main').load('reservation.html');}   // Load the Reservation page

    else if (page=='signIn')     {$('main').load('signIn.html');}        // Load the Employee Sign In page
}