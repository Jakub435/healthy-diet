var childDate = getChildDate();
var childDateNow = 1;



$(document).ready(function(){
    tabSize();
    //get data from server
    $.ajax({
        type:"GET",
        url:"/myDiet/getusermeals",
        dataType:"json",
        success:function(data){
            if(data[0]){ showMeals(data) }
            else{
                $('#some').append("<li>Brak posiłków do wyświetlenia!</li>")
            }
        }
    });
});

$(window).resize(function(){
    tabSize();
});



//DataPicker
$('.hButton').first().on('click', function(){
    if(childDateNow > 1){
        wid = $('#dataPicker ul li').css('width');
        wid = parseInt(wid) + 4;
        $("#dataPicker ul li").animate({ "left": '+=' + wid}, "fast" );
        childDateNow--;
    }
});

$('.hButton').last().on('click', function(){
    if(childDateNow < childDate-3){
        wid = $('#dataPicker ul li').css('width');
        wid = parseInt(wid) + 4;
        $("#dataPicker ul li").animate({ "left": '-=' + wid}, "fast" );
        childDateNow++;
    }
});
//====================functions======================


function tabSize(){
    var wid = $('#dataPicker').children('ul').css('width');
    wid = parseInt(wid)/4 - 4;
    $('#datapicker li').css('min-width', wid);
}

function getChildDate(){return parseInt($('#dataPicker ul > li').length);}

function showMeals(data){
    var date;
    var product = '';
    var type = data[0].meal_type;
    var mealType = ['śniadanie:','II śniadanie:','obiad:','podwieczorek:','kolacja:'];
    var days=['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela']
    var count = -1;
    for(i in data){
        if(data[i].date!=date){//when date is changed
            count++;
            dataDate = (data[i].date).split('-');
            var dates = new Date;
            dates.setMonth(dataDate[0]-1);
            dates.setDate(dataDate[1]-1);
            $('#some').append('<li>' + days[dates.getDay()] + '<br>' + data[i].date + '</li>');

            if(!date){
                $('#container').append("<div id='container" + count + "'></div>");
            }else{
                $('#container').append("<div class='hidden' id='container" + count + "'></div>");
            }
                
        }

        if(data[i].meal_type == type){
            product += '<li>' + data[i].product_name +': ' + Math.round(data[i].weight*data[i].percent_per_meal) + '</li> ';
            
            if(i==(data.length-1)){    
                var route ='#container'+count; 
                $(route).append("<div class=\"meals\"><h2>" + mealType[data[i].meal_type] +' ' + data[i].meal_name + "</h2><ul>" + product + "</ul><p>" + data[i].preparation + "</p></div>");
            }
            
        }else if(data[i].meal_type != type && data[i].date != date){
            var route ='#container'+(count-1); 
            $(route).append("<div class=\"meals\"><h2>" + mealType[data[i-1].meal_type] +' ' + data[i-1].meal_name + "</h2><ul>" + product + "</ul><p>" + data[i-1].preparation + "</p></div>");

            
            product = '<li>' + data[i].product_name + ': ' + Math.round(data[i].weight*data[i].percent_per_meal) + '</li> ';
        }else{
            var route ='#container'+count; 
            $(route).append("<div class=\"meals\"><h2>" + mealType[data[i-1].meal_type] +' ' + data[i-1].meal_name + "</h2><ul>" + product + "</ul><p>" + data[i-1].preparation + "</p></div>");
            
            
            product = '<li>' + data[i].product_name + ': ' + Math.round(data[i].weight*data[i].percent_per_meal) + '</li> ';
        }
        type = data[i].meal_type;
        date = data[i].date;
    }
    tabSize();
    childDate = getChildDate();
    
    $('#some li').on('click',function(){
        route='#container'+$('#some li').index(this);
        $('#container div:visible').not($('.meals')).hide(1000);
        $(route).show(500);
        $('#some li').css('background-color','rgba(174, 242, 19, 0.65)');
        $(this).css('background-color','rgba(150, 217, 16, 0.8)'); 
    });

}