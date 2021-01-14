$(document).ready(function () {
    $(document).on("click","#continueButton",function(){
        $('main').load('second.html');
    })

    $(document).on("click","#customerButton",function(){
        $('main').load('reservation.html');
    })

    $(document).on("click","#employeeButton",function(){
        $('main').load('signIn.html');
    })
});
