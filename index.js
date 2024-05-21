const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express = require("express");
const path =require("path");
let app = express();
const methodOverride = require('method-override')

app.use(methodOverride('_method'))
app.set("views",path.join(__dirname,"views"));
app.set("views engine",'ejs');
app.use(express.urlencoded({extended:true}));

// let createRandomUser=()=>{
//     return [
//       faker.datatype.uuid(),
//       faker.internet.userName(),
//       faker.internet.email(),
//       faker.internet.password()
//   ];
//   }

const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"dbcheck",
    password:"ajay2003"
});

// q="insert into user(id,username,email,password) values ?";
// let data1=[["124","dayal","daya@gmail.com","dayagolmal"],["143","virat","kohli@gmail.com","18anushka"]]
// q="show tables"

// let data=[];
// for(let i=1;i<=100;i++){
//     data.push(createRandomUser());
// }
app.get("/",(req,res)=>{
  let q="select count(*) from user";
  try{
    connection.query(q,(err,results)=>{
        if (err) throw err;
        let count = results[0]["count(*)"];
        res.render("home.ejs",{count});
    });
}
catch(err){
    console.log(err);
    res.send("some error occured !");
}
});

app.get("/user",(req,res)=>{
  let q1="select * from user";
  try{
    connection.query(q1,(err,results)=>{
        if (err) throw err;
        res.render("show.ejs",{results});
    });
}
catch(err){
    console.log(err);
    res.send("some error occured !");
}
});

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select *from user where id='${id}'`;
  try{
    connection.query(q,(err,results)=>{
        if (err) throw err;
        let result=results[0]
        res.render("edit.ejs",{result});
    });
}
catch(err){
    console.log(err);
    res.send("some error occured !");
}
});
//UPDATE ROUTE
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {username: user , password: pwd}=req.body;
  let  q=`select *from user where id='${id}'`;
  try{
    connection.query(q,(err,results)=>{
        if (err) throw err;
        let rem=results[0]
        if (pwd != rem.password){
            res.send("Wrong password !")
        }
        else{
            let q1=`update user set username="${user}" where id='${id}'`;
                connection.query(q1,(err,results)=>{
                    if (err) throw err;
                    console.log(results);
                    res.redirect("/user");
                });
        }
    });
}
catch(err){
    console.log(err);
    res.send("some error occured !");
}
});

app.get("/user/new",(req,res)=>{
    res.render("insert.ejs")
});

app.post("/new",(req,res)=>{
    let {id,username,email,password}=req.body;
    let q=`insert into user values('${id}','${username}','${email}','${password}')`;
    try{
        connection.query(q,(err,results)=>{
            if (err) throw err;
            res.redirect("/user")
        });
    }
    catch(err){
        console.log(err);
        res.send("some error occured !");
    }
});

app.delete("/user/:username",(req,res)=>{
    let {username}=req.params;
    let q=`delete from user where username='${username}'`;
    try{
        connection.query(q,(err,results)=>{
            if (err) throw err;
            res.redirect("/user")
        });
    }
    catch(err){
        console.log(err);
        res.send("some error occured !");
    }

})

app.listen("8080",()=>{
  console.log('listening to port 8080');
})

// connection.end();