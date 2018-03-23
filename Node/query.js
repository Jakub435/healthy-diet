
var Sequelize = require('Sequelize');
var User_meal = require('./models/user_meal');
var Progress = require('./models/progress');

var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
});


module.exports = {
    getMeals: function(req, res, next){
        var mealType = req.params.mealType;

        sequelize.query("SELECT product_name, id, meal_name, cost_per_unit, kcal_per_unit FROM(SELECT product_name, recipe_id FROM public.\"meal_products\" a INNER JOIN public.\"products\" b ON a.product_id=b.id) c INNER JOIN public.\"recipes\" d ON c.recipe_id=d.id WHERE meal_type='" + mealType + "'"
        ,{ type: sequelize.QueryTypes.SELECT})
        .then(function(data, err) {
            if(err){
                console.error(err);
                res.statusCode = 500;
                return res.json({errors:['Could not retrive meals']});
            }
            req.data = data;
            next();
        });
    },
    setUserMeals: function(data, id){
        User_meal.destroy({
            where:{user_id:id}
        }).then( function(){
            for(meal in data.meals){
                User_meal.create(data.meals[meal])
                    .then(function(dat, err){
                        if(err){console.log("ERROR: "+err);}
                });
            }
        });

    },
    //for createDiet
    getUserMeals:function(req,res,next){
        if (req.session.user && req.cookies.user_sid) {
            sequelize.query("select recipe_id,date,weight,a.meal_type, meal_name from public.\"user_meals\" a INNER JOIN public.\"recipes\" b ON a.recipe_id=b.id"
            ,{ type: sequelize.QueryTypes.SELECT})
                .then(function(data){
                        req.data = data;
                        next();
                });
        } else { res.redirect('/login'); }
    },
    //for my diet
    getAllUserMeals:function(req,res,next){
        if (req.session.user && req.cookies.user_sid) {
            sequelize.query("select meal_type,meal_name,preparation,date,weight,product_name,percent_per_meal from(select meal_type,meal_name,preparation,date,weight, product_id,percent_per_meal from (select a.meal_type,meal_name,preparation,date,weight,recipe_id from public.\"user_meals\" a INNER JOIN public.\"recipes\" b ON a.recipe_id=b.id where user_id = " + req.session.user.id + ") c INNER JOIN public.\"meal_products\" d on c.recipe_id=d.recipe_id) e INNER JOIN public.\"products\" f on e.product_id=f.id ORDER BY date,meal_type ASC"
            ,{type: sequelize.QueryTypes.SELECT}).then(function(data){
                req.data = data;
                next();
            });
        } else { res.redirect('/login'); }
    },
    setUserProgress:function(progress){
        Progress.count({where:{ date:progress.date } })
        .then(function(count){
            console.log(count);
            if(count==0){
                Progress.create(progress);
            }else {
                Progress.update(progress,
                    {where: { date:progress.date }
                });
            }
        });
    },getUserProp:function(req,res,next){
        if (req.session.user && req.cookies.user_sid) {
            sequelize.query("select born, height FROM public.\"users\" where id = " + req.session.user.id
            ,{ type: sequelize.QueryTypes.SELECT})
                .then(function(data){
                        req.data = data;
                        next();
                });
        } else { res.redirect('/login'); }
    },getUserProgress:function(req,res,next){
        if (req.session.user && req.cookies.user_sid) {

            var data = Progress.findAll({
                where: { user_id: req.session.user.id },
                order: [
                    ['date', 'ASC'],
                ],
            }).then(function(data){
                req.data = data;
                next();
            });
        } else { res.redirect('/login'); }
    }
}
