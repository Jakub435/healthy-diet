var childDateNow = 1;
var childDate = getChildDate();
var time = new Date();
createColumn(10);
var mealJSON = []
var clientId;
var kcal;

$(document).ready(function(){
    jQuery('.scrollbar-external').scrollbar({
            "autoScrollSize": false,
            "scrolly": $('.external-scroll_y')
    });
    tabSize();

    //get client id and kcal per day
    $.ajax({
        type: 'GET',
        url: 'http://localhost:9000/createDiet/getIdKcal',
        dataType: 'json',
        success: function(data){
            clientId = data.id;
            kcal = data.kcal/5;
            getMeal('breakfast');
        }
    });
    getUserMeal();
});



$(window).resize(function(){tabSize();});


$('.hButton').first().on('click', function(){
    if(childDateNow > 1){
        wid = getDataPickerUlSize()
        $("#dataPicker ul li").animate({ "left": '+=' + wid}, "fast" );
        childDateNow--;
    }
});

$('.hButton').last().on('click', function(){
    if(childDateNow < childDate-2){
        wid = getDataPickerUlSize()
        $("#dataPicker ul li").animate({ "left": '-=' + wid}, "fast" );
        childDateNow++;
    }
});



$('.row').droppable({
    classes:{"ui-droppable-active": "custom-state-active"},
    drop: function(event, ui){
        var name = $(ui.draggable).children('h4').text();
        $(this).html("<h4 id='" + $(ui.draggable).attr('id') + "' data-kcal='" + $(ui.draggable).attr('data-kcal') + "'>" + name + "</h4>");
    }
});

//change mealType
$('#mealType').on('change', function(){
    var mealType = $(this).find(":selected").attr('value');
    getMeal(mealType);
});

$('#mealSort').on('change',function(){
    var sortType = $(this).find(":selected").attr('value');
    sortMeal(mealJSON, 'cost_per_unit', sortType);
    showMeal(mealJSON);
});

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$('#searchInput').keyup(function(){
    delay(function(){
        var meal = [];
        var searchField = $('#searchInput').val();
        var expression = new RegExp(searchField, "i");

        $.each(mealJSON, function(key, value){
            if (value.meal_name.search(expression) != -1 || value.product_name.search(expression) != -1)
            { meal.push(value); }
        });
        showMeal(meal);
    }, 200 );
});

$('div.button').on('click', function(){
    var meal = {"meals": []};
    $('.column').each(function(){
        var date = $(this).children('.firstrow').children('h4').html();
        date = date.split('<br>')
        var count = 0;
        $(this).children('.row').children('h4').each(function(){
            if($(this).attr('id') && $(this).attr('data-kcal')){
                meal.meals.push({
                    user_id: clientId,
                    recipe_id: $(this).attr('id'),
                    date: date[1],
                    weight: $(this).attr('data-kcal')*kcal,
                    meal_type: count
                });
            }
            count++;
        });
    });
    setUserMeal(meal);
});

/*
=======================FUNCTIONS=======================
*/

//post user diet to server
function setUserMeal(meals){
    $.ajax({
       type: 'POST',
        url: '/createDiet',
        dataType: 'json',
        data: meals,
        success:function(data){
            $('#fixedbar')
                .css('background-color','rgba(134, 186, 15, 0.9)')
                .html('Posiłki zostały zapisane pomyślnie.')
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        },
        error:function(err){
            $('#fixedbar')
                .css('background-color','rgba(186, 15, 15, 0.9)')
                .html("Podczas zapisywania wystąpił błąd! Spróbuj ponownie za kilka sekund.")
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        }
    });

}


//get user diet from server
function getUserMeal(){
    $.ajax({
        type: 'GET',
        url: '/createDiet/usermeals',
        dataType: 'json',
        success: function(data){

            var len = $('.column').length;
            for(meal in data){
                for(i=1;i<=len;i++){

                    var date = $('li.column:nth-child(' + i + ')')
                    .children('.firstrow')
                    .children('h4').html().split("<br>");

                    if(date[1] == data[meal].date){

                        var html = "<h4 id='" + data[meal].recipe_id +
                            "' data-kcal='" + data[meal].weight/kcal +
                            "'>" + data[meal].meal_name + "</h4>"

                        var child = parseInt(data[meal].meal_type) + 2;

                        $('li.column:nth-child(' + i + ')')
                            .children('.row:nth-child(' + child + ')')
                            .html(html);
                    }
                }
            }
        }
    });
}

function tabSize(){
    var wid = $('#dataPickerContainer ul').css('width');
    wid = 6 + parseInt(wid)/3;
    $('#datapickerContainer li').css('min-width', wid);
    $('.firstrow').css('min-width', wid);
    $('.row').css({"width" : wid});
}

function getChildDate(){return parseInt($('#dataPickerContainer ul > li').length);}

function getDataPickerUlSize(){return parseInt($('#dataPicker ul li').css('width'))+3}


function createColumn(count){
    var dayName = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    for(i=0;i < count;i++){
        var month = time.getMonth() + 1;

        if(month<10){month = "0" + month;}

        var today = month + "-" + time.getDate();

        var liHtml = "<li class='column'><div class='firstrow'><h4>" + dayName[time.getDay()] + "</br>" + today + "</h4></div><div class='row'><h4>Śniadanie</h4></div><div class='row'><h4>II Śniadanie</h4></div><div class='row'><h4>Obiad</h4></div><div class='row'><h4>Podwieczorek</h4></div><div class='row'><h4>kolacja</h4></div></li>"

        $('#dataPickerContainer ul').append(liHtml);
        time.setDate(time.getDate() + 1);

    }
    childDate = getChildDate();
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

// get Json data from server
function getMeal(mealType){

    var getMealsUrl = "http://localhost:9000/createDiet/getMeals/" + mealType;

    $.ajax({
       type: 'GET',
        url: getMealsUrl,
        dataType: 'json',
        success: function(data){

            mealJSON = [];
            var ID = null;
            var products = '';

            for(i in data){
                if(data[i].id == ID || ID == null){
                    products = products + data[i].product_name +', ';
                }else{
                    mealJSON.push({
                        cost_per_unit: (data[i-1].cost_per_unit * kcal * data[i-1].kcal_per_unit).toFixed(2),
                        id: data[i-1].id,
                        meal_name: data[i-1].meal_name,
                        product_name: products,
                        kcal: data[i-1].kcal_per_unit
                    });

                    products = '';
                    products = products + data[i].product_name +', ';
                }
                ID = data[i].id;
            }
            mealJSON = sortMeal(mealJSON,'cost_per_unit', 'asc');
            showMeal(mealJSON);
        }
    });
}

function showMeal(meals){
    $('.rem').remove();

    for(i in meals){

        var div = "<div id='" + meals[i].id + "' data-kcal='" + meals[i].kcal + "' class = \"rem\"><h4>" + meals[i].meal_name + "</h4><span class=\"font\">Składniki:</span><br /><span class=\"font\">" + meals[i].product_name + "</span><p class=\"font\">Koszt: " + meals[i].cost_per_unit + "</p></div>";

        $('div.scrollbar-external').append(div);

    }
    makeDraggable();
}

// make recipe draggable
function makeDraggable(){
    $('.scrollbar-external div').draggable({
        cancel: "a.ui-icon",
        appendTo: "#dataPickerContainer",
        revert: "invalid",
        containment: "window",
        scroll: false,
        cursor: "move",
        cursorAt: { top: 50, left: 75 },
        helper: function( event ) {
            return $("<div class='helper font'>"+$(this).children('h4').text()+"</div>");
        }
    });
}

function sortMeal(arr, prop, asc){
    arr = arr.sort(function(a, b){
        if (asc == 'asc') {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return arr;
}
