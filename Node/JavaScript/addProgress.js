var height;
var age;
$.ajax({
    type:'get',
    url:'/progress/getUserProp',
    dataType:'json',
    success:function(data){
        height = data[0].height;
        age = (new Date() - new Date(data[0].born));
        age = new Date(age).getFullYear() -1970;
    }
});

$('input[type="text"]').keyup(function(){
    var text = $(this).val();
    if($.isNumeric(text) || text == ''){
        $(this).siblings('h5').removeClass('invalid');
    }else{
        $(this).siblings('h5').addClass('invalid');
    }
});

$('#progress li div').click(function(){
    var data = [];
    $('#progress input[type="text"]').each(function(){
        var text = $(this).val();
        data.push(text);
    });
    data = {
        weight:data[0],
        biceps:data[1],
        forearm:data[2],
        chest:data[3],
        waist:data[4],
        hip:data[5],
        thigh:data[6],
        calf:data[7],
        bf:data[8]
    }
    setUserprogress(data);
});

$('.bf').keyup(bf);

$('#progress input[name="sex"]').on('change', bf);

function setUserprogress(data){
    $.ajax({
       type: 'POST',
        url: '/progress',
        dataType: 'json',
        data: data,
        success:function(data){
            $('#fixedbar')
                .css('background-color','rgba(134, 186, 15, 0.9)')
                .html('Postępy zostały zapisane pomyślnie.')
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        },
        error:function(err){
            $('#fixedbar')
                .css('background-color','rgba(186, 15, 15, 0.9)')
                .html("Podczas zapisywania wystąpił błąd! Sprawdź poprawność wprowadzonych danych!")
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        }
    });
}

//calc body fat index
function bf(){
    var weight = $('#progress li:nth-child(3) input').val();

    var bmi = weight/(height*height)
    var bf;

    if(bmi < 25){
        if($('#progress input[name="sex"]:checked').val() == 'K'){
            bf = weight - (0.384 * weight + 0.129 * height);
        }else{
            bf = weight - (0.278 * weight + 0.22 * height);
        }
    }else{
        if($('#progress input[name="sex"]:checked').val() == 'K'){
            bf = 0.76 * weight - 0.177 * height;
        }else{
            bf = 0.512 * weight - 0.089 * height;
        }
    }
    
    if(bf>0){ $('#progress li:nth-child(11) input').val(bf.toFixed(2)); }
}

$('#kcal input[type="radio"]').on('change',kcal);
$('#kcal select').on('change',kcal);
$('#kcal li:nth-child(6) input').keyup(kcal);

function kcal(){
    var sex = $('#kcal input[name="sex"]:checked').val();
    var lifeStyle = $('#kcal li:nth-child(3) option:selected').val();
    var organism = $('#kcal li:nth-child(4) option:selected').val();
    var goal = $('#kcal input[name="goal"]:checked').val();
    var weight = $('#kcal li:nth-child(6) input').val();
    var red = ['0.9','0.85','0.8'];
    var mas = ['1.2','1.15','1.1'];
    var kcal;
    
    if(sex == 'K'){
        kcal = 655 + (9.6 * weight) + (1.85 * height) - (4.7 * age);
    }else{
        kcal = 66.5 + (13.7 * weight) + (5 * height) - (6.8 * age);
    }

    kcal = kcal * lifeStyle;
    if(goal == 'R'){ kcal = kcal * red[organism] }
    else{ kcal = kcal * mas[organism] }
    if(kcal>0){ $('#kcal li:nth-child(7) input').val(Math.round(kcal)); }
}
//#kcal > ul:nth-child(1) > li:nth-child(7) > input:nth-child(2)
$('#kcal li:nth-child(8)').click(function(){
    data = {kcal: $('#kcal li:nth-child(7) input').val()}
    $.ajax({
       type: 'POST',
        url: '/kcal',
        dataType: 'json',
        data: data,
        success:function(data){
            $('#fixedbar')
                .css('background-color','rgba(134, 186, 15, 0.9)')
                .html('Postępy zostały zapisane pomyślnie.')
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        },
        error:function(err){
            $('#fixedbar')
                .css('background-color','rgba(186, 15, 15, 0.9)')
                .html("Podczas zapisywania wystąpił błąd! Sprawdź poprawność wprowadzonych danych!")
                .show(300);

            setTimeout(function(){
                $('#fixedbar').hide(300);
            },4000)
        }
    });
})