// document.getElementById("resultsDiv").style.display = "none";
$(document).ready(function(){
    // $("#resultsDiv").addClass("d-flex");
    $("#resultsDiv").addClass("d-none");
    $("#resultsDiv2").addClass("d-none");
    
})

$(".btnProjectCalculator").click(function(){
    $(".calculator1").removeClass("d-none");
    $(".calculator2").addClass("d-none");
    $(".mainDiv").addClass("d-none");
});

$(".cal1").click(function(){
    $(".calculator1").removeClass("d-none");
    $(".calculator2").addClass("d-none");
    $(".mainDiv").addClass("d-none");
    window.location.href = "./calculator1.html";
});

$(".cal2").click(function(){
    // $(".calculator1").addClass("d-none");
    // $(".calculator2").removeClass("d-none");
    // $(".mainDiv").addClass("d-none");
    window.location.href = "./calculator2.html";
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

let profile = getCookie("profile");
if (profile != false) {
    data = JSON.parse(profile);
    // console.log(data);
    $("#textName").val(data.name);
    $("#textEmail").val(data.email);
    $("#textContact").val(data.contact);
    $("#textIndustry").val(data.industry);
    $("#noEmployees").val(data.emp);
}


$("#btnSave").click(function () {
        $("#companyInfoForm").submit();
        // $("#exampleModal").modal('hide');
});
let calculatorSelection = 1;

$("#modalOpen").click(function() {
    let nCharger = parseInt($('#evChargers').val());
    let sqFT = parseInt($('#squareFootage').val());
    let typeCharger = $('#typeOfCharger').val();

    if(nCharger > 0 && sqFT > 0 && (typeCharger == "post" || typeCharger == "wall"))
    {
        $("#exampleModal").modal('show');
        calculatorSelection = 1;
    }
    else
    {
        alert("Please Enter Distance Correctly!");
    }
});

$(".modalOpen").click(function(){
    let nCharger = parseInt($('#evChargers2').val());
    let batterySize = parseInt($('#batterySize').val());
    let noVehicles = parseInt($('#noVehicles').val());
    let energyCost = parseFloat($("#energyCost").val());
    let chargeCost = parseFloat($("#chargeCost").val());
    let projectCost = parseFloat($("#projectCost").val());

    if(!isNaN(energyCost) && !isNaN(chargeCost) && !isNaN(projectCost))
    {
        $("#exampleModal").modal("show");
        calculatorSelection = 2;
    }
    else
    {
        alert("Please Check all fields");
    }
});

$("#companyInfoForm").submit(function (e) {
    e.preventDefault();
    let name = $("#textName").val();
    let email = $("#textEmail").val();
    let contact = $("#textContact").val();
    let industry = $("#textIndustry").val();
    let noEmployee = $("#noEmployees").val();
    //required input validation
    if (name == "" || email == "" || contact == "" || industry == "" || noEmployee == "") {
        alert('Please input all required fields');
        return false;
    }

    $("#exampleModal").modal('hide');

    let profile = {
        "name": name,
        "email": email,
        "contact": contact,
        "industry": industry,
        "emp": parseInt(noEmployee)
    }
    $.ajax({
        type: "POST",
        url: "./mail-new.php",
        data: profile,
        success: function(data) {
            console.log(data);
    }

});


    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = "profile=" + JSON.stringify(profile) + ";" + expires + ";path=/";
    showResults();

});

let newConstruction = document.getElementById('newConstruction');
let garageUpdate = document.getElementById('garageUpdate');

newConstruction.addEventListener('click', updateSelection1);
garageUpdate.addEventListener('click', updateSelection2);


function updateSelection1() {
    newConstruction.classList.add("active");
    garageUpdate.classList.remove("active");
    typeOfCharger.value = 'wall';
    
}

function updateSelection2() {
    garageUpdate.classList.add("active");
    newConstruction.classList.remove("active");
    typeOfCharger.value = 'post';
    
}

$("input[type='radio'][name='bay']").focus(function () {
    $(this).addClass('active');
    $("#bays").val($(this).val());
    // console.log("Bay: " + $(this).val());
}).blur(function () {
    $(this).removeClass('active');
});

$("input[type='radio'][name='backs']").focus(function () {
    $(this).addClass('active');
    $("#backs").val($(this).val());
    // console.log("Back: " + $(this).val());
}).blur(function () {
    $(this).removeClass('active');
});
// console.log("Bay: " + $("input[type='radio'][name='bay']:checked").val());
// console.log("Back: " + $("input[type='radio'][name='backs']:checked").val());

$("input[type='radio'][name='backs']:checked").parent().addClass("active");
$("input[type='radio'][name='bay']:checked").parent().addClass("active");


let toComma = (x) => "£ " + Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


function showResults() {
    if(calculatorSelection == 1)
    {
        let nCharger = parseInt($('#evChargers').val());
        let typeCharger = $('#typeOfCharger').val();
        let distanceMetre = parseInt($('#squareFootage').val());
        let bays = $('#backs').val();
        let back = $('#bays').val();
    
        let total = 0.0;
        let chargerAmount = parseFloat(nCharger * 1250);
        let grant = parseFloat(nCharger * 291);
    
        let typeAmount = typeCharger == "post" ? total += 240.00 : total += 0.00;
        let distanceAmount = distanceMetre * 17.00;
        let backAmount = back == "yes" ? 80.00 * nCharger : 0.00;
        let bayAmount = bays == "yes" ? 500.00 * nCharger : 0.00;
        let otherCost = 80+100+150 ;
        total = parseFloat(chargerAmount + typeAmount + distanceAmount + backAmount + bayAmount + otherCost);
    
        let totalWithGrant = total - grant;
        $("#resultsDiv").removeClass("d-none")
        $('html, body').animate({
                    scrollTop: $("#resultsDiv").addClass("d-flex").offset().top
                }, 500);
        $('#estimatedConstructionCost').text(toComma(total));
        $('#estimatedConstructionCostWithGrant').text(toComma(totalWithGrant));
    }
    else
    {
        let nCharger = parseInt($('#evChargers2').val());
        let batterySize = parseInt($('#batterySize').val());
        let noVehicles = parseInt($('#noVehicles').val());
        let energyCost = parseFloat($("#energyCost").val());
        let chargeCost = parseFloat($("#chargeCost").val());
        let projectCost = parseFloat($("#projectCost").val());
        
        let totalEnergy = nCharger * batterySize * noVehicles;
        let eCost = totalEnergy * nCharger * energyCost;
        let revenueFees = (totalEnergy * chargeCost) * 0.875 * nCharger;
        let profitPerDay = revenueFees - eCost;
        let returnDays = (projectCost / profitPerDay).toFixed(2);
        
        $("#resultsDiv2").removeClass("d-none")
        $('html, body').animate({
                    scrollTop: $("#resultsDiv2").addClass("d-flex").offset().top
                }, 500);
        // $('#estimatedConstructionCost').text(toComma(total));
        $('#estimatedConstructionCostWithGrant2').html(returnDays + " days");
        
    }
    

}
