var child = 1;

$('.vButton').last().on('click',function(){
    if(child<5){
        $('#container div:nth-child(' + child + ')').slideUp();
        $('#container div:nth-child(' + (child + 1) + ')').slideDown();
        child++;
    }
});

$('.vButton').first().on('click',function(){
    if(child>1){
        $('#container div:nth-child(' + (child - 1) + ')').slideDown();
        $('#container div:nth-child(' + child + ')').slideUp();
        child--;
    }
});

$('.hButton').first().on('click', function(){
    wid = $('#dataPicker ul li').css('width');
    wid = parseInt(wid) + 6;
    $("#dataPicker ul li").animate({ "left": '+=' + wid}, "slow" );
});

$('.hButton').last().on('click', function(){
    wid = $('#dataPicker ul li').css('width');
    wid = parseInt(wid) + 6;
    $("#dataPicker ul li").animate({ "left": '-=' + wid}, "slow" );
});