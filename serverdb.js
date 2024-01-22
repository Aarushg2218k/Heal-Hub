var express = require("express");
var fileuploader = require("express-fileupload");
var nodemailer = require("nodemailer");
var mysql = require("mysql2");
var app = express();

app.listen(2003, function () {
    console.log("hii");
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aarushg2218k@gmail.com',
      pass: 'xwffofogoqmukkfv'
    }
  });

 

app.use(express.static("Files"));
app.use(fileuploader());
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "Aarushg@2003",
    database: "profile2",
    dateStrings: true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("Connected Successfulllyyy...");
    else
        console.log(jasoos);
})

app.use(express.urlencoded(true));

app.get("/profile-donor",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/profile-donor.html");
})
app.get("/Avail-med",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/avail-med.html");
})
app.get("/profile-needy",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/profile-needy.html");
})
app.get("/All-users",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/panel-users.html");
})
app.get("/Donor-users",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/panel-donors.html");
})
app.get("/Needy-users",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/panel-needies.html");
})
app.get("/find-med",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/finder-med.html");
})
app.get("/manage-med",function(req,resp){
    resp.sendFile(process.cwd()+"/Files/med-manager.html");
})

app.post("/donor-save", function (req, resp) {

    var txtemail = req.body.txtemail;
    var txtname = req.body.txtname;
    var txtnumber = req.body.txtnumber;
    var txtadd = req.body.txtadd;
    var txtcity = req.body.txtcity;
    var avail = req.body.txttime;
    var avail2 = req.body.txttime2;
    var txtgender = req.body.txtgender;
    var txtproof = req.body.txtproof;

    var txtfile = "nopic.jpg";
    if (req.files != null) {
        var txtfile = req.files.txtfile.name;
        var path = process.cwd() + "/files/pics/" + txtfile;
        req.files.txtfile.mv(path);

    }

    dbCon.query("insert into donors(email,name,mobile,address,city,afrom,ato,gender,proof,file) values(?,?,?,?,?,?,?,?,?,?)", [txtemail, txtname, txtnumber, txtadd, txtcity ,avail,avail2, txtgender, txtproof, txtfile], function (err) {
        if (err == null)
            resp.send("Account Created Successfully");
        else
            resp.send(err);
    })
})

app.post("/donor-update", function (req, resp) {

    var txtemail = req.body.txtemail;
    var txtname = req.body.txtname;
    var txtnumber = req.body.txtnumber;
    var txtadd = req.body.txtadd;
    var txtcity = req.body.txtcity;
    var afrom = req.body.txttime;
    var ato = req.body.txttime2;
    var txtgender = req.body.txtgender;
    var txtproof = req.body.txtproof;

    var fileName;
  if(req.files!=null){
      fileName=req.files.txtfile.name;
     var path=process.cwd()+"/files/pics/"+fileName;
     req.files.txtfile.mv(path);
   }
   else
   {
    fileName=req.body.hdn;
   }

    dbCon.query("update donors set name = ? , mobile = ? , address = ? , city = ? , afrom=?, ato=? , gender = ? , proof = ? , file = ? where email=?", [txtname, txtnumber, txtadd, txtcity, afrom, ato , txtgender, txtproof, fileName, txtemail], function (err, result) {

        if (err == null) {

            if (result.affectedRows == 1) {
                resp.send("Profile Updated");
            }

            else {
                resp.send("Profile Not Exist");
            }
        }

        else {
            resp.send(err);
        }
    })

})
app.get("/donor-search", function (req, resp) {
    dbCon.query("select * from donors where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
        if ((err == null)) {
            resp.send(resultTableJSON);
        }
        else {
            resp.send(err);
        }
    })
})

app.get("/Sign-up", function (req, resp) {
    dbCon.query("insert into users(txtemail,txtpass,txtsel,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchEmail, req.query.kuchpass, req.query.kuchsel], function (err, resultTable) {
        if (err == null) {
            if (resultTable.affectedRows == 1)
                resp.send("Signup successfully");
            else
                resp.send("Signup Unsuccessfully");
        }
        else
            resp.send(err);
    })
})
app.get("/log-in",function(req,resp){
    dbCon.query("select * from users where txtemail=?" , [req.query.kuchEmail] , function(err , resJSON){
            if(err==null){
                if(resJSON.length==1 && resJSON[0].status==1 && resJSON[0].txtpass==req.query.kuchpass){
                        resp.send(resJSON[0].txtsel);       
                }
                else if(resJSON.length==1 && resJSON[0].status==1 &&  resJSON[0].txtpass!=req.query.kuchpass){
                        resp.send("Invalid Password");       
                }
                else if(resJSON.length==1 && resJSON[0].status==0 ){
                    resp.send("Account Blocked");
                }
                else{
                    resp.send("Invalid Email");
                }
            }
            else{
                resp.send(err);
            }
    })
})

app.get("/avail-meds", function (req, resp) {
    dbCon.query("insert into medsavailable(email,med,expdate,packing,qty) values(?,?,?,?,?)", [req.query.kuchemail,req.query.kuchname,req.query.kuchdate,req.query.kuchpack,req.query.kuchquan], function (err) {
        if (err == null){
            resp.send("Medicines Added");
        }
        else
            resp.send(err);
    })
})

app.get("/chng-pass", function (req, resp) {

    dbCon.query("update users set txtpass = ? where txtemail=? and txtpass =? ", [req.query.kuchnewpass,req.query.kuchEmail,req.query.kucholdpass], function (err,result) {
        if (err == null){

            if(result.affectedRows==1){
                resp.send("Password Changed");
            }
            else{
                resp.send("Invalid Old Password")
            }

        }
            
        else
        // console.log(err);
            resp.send(err);
    })
})

app.get("/send-mail",function(req,resp){
    
    dbCon.query("select txtpass from users where txtemail=?",[req.query.kuchEmail2],function(err,password){
        if(err==null){
            var text=JSON.stringify(password);
        var mailOptions = {
            from: 'aarushg2218k@gmail',
            to: req.query.kuchEmail2,
            subject: 'Sending Email using Node.js',
            text: text
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
        else{
            resp.send(err);
          }
    })
})

app.post("/needy-save", function (req, resp) {

    var txtemail = req.body.txtemail;
    var txtname = req.body.txtname;
    var txtnumber = req.body.txtnumber;
    var txtdate=req.body.txtdate;
    var txtgender = req.body.txtgender;
    var txtcity = req.body.txtcity;
    var txtadd = req.body.txtadd;

    var txtfile = "nopic.jpg";
    if (req.files != null) {
        var txtfile = req.files.txtfile.name;
        var path = process.cwd() + "/files/pics/" + txtfile;
        req.files.txtfile.mv(path);

    }

    dbCon.query("insert into needy(email,name,mobile,dob,gender,city,address,picname) values(?,?,?,?,?,?,?,?)", [txtemail, txtname, txtnumber, txtdate, txtgender,txtcity,txtadd,txtfile], function (err) {
        if (err == null)
            resp.send("Account Created Successfully");
        else
            resp.send(err);
    })
})

app.post("/needy-update", function (req, resp) {

    var txtemail = req.body.txtemail;
    var txtname = req.body.txtname;
    var txtnumber = req.body.txtnumber;
    var txtdate=req.body.txtdate;
    var txtgender = req.body.txtgender;
    var txtcity = req.body.txtcity;
    var txtadd = req.body.txtadd;

    var txtfile;
  if(req.files!=null){
      txtfile=req.files.txtfile.name;
     var path=process.cwd()+"/files/pics/"+txtfile;
     req.files.txtfile.mv(path);
   }
   else
   {
    txtfile=req.body.hdn;
   }

    dbCon.query("update needy set name = ? , mobile = ? , dob = ? , gender = ? , city = ? , address = ? , picname = ? where email=?", [txtname, txtnumber, txtdate, txtgender, txtcity, txtadd,txtfile, txtemail], function (err, result) {

        if (err == null) {

            if (result.affectedRows == 1) {
                resp.send("Profile Updated");
            }

            else {
                resp.send("Profile Not Exist");
            }
        }

        else {
            resp.send(err);
        }
    })

})
app.get("/needy-search" , function(req , resp){
    dbCon.query("select * from needy where email = ? " , [req.query.aEmail] , function(err , resJSON){
        if(err==null){
            resp.send(resJSON)
        }

        else{
            resp.send(err);
        }
    })  
})
app.get("/angular-all-records",function(req,resp){
    dbCon.query("select * from users",function(err,table){
        if(err==null){
            resp.send(table);
        }
        else{
            resp.send(err);
        }
    })
})
app.get("/angular-donor-records",function(req,resp){
    dbCon.query("select * from donors",function(err,table){
        if(err==null){
            resp.send(table);
        }
        else{
            resp.send(err);
        }
    })
})
app.get("/angular-needy-records",function(req,resp){
    dbCon.query("select * from needy",function(err,table){
        if(err==null){
            resp.send(table);
        }
        else{
            resp.send(err);
        }
    })
})

app.get("/block-user",function(req,resp)
{
    var email=req.query.email;                          
    dbCon.query("update users set status=0 where txtemail=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Blocked ");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/resume-user",function(req,resp)
{
    var email=req.query.email;                          
    dbCon.query("update users set status=1 where txtemail=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Resumed");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
app.get("/exp-med",function(req,resp){
    dbCon.query("delete from medsavailable where expdate <= current_date()",function(err,result){
        if(err==null)
        {
            
            if(result.affectedRows==1){
                resp.send("Medicines removed");
            }
            else{
                resp.send("No Exp. Medicines Available");
            }

        }
        else{
            resp.send(err);
        }
    })
})
app.get("/donate-med",function(req,resp){
    // console.log(req.query.email);
    var eml=req.query.email;
    // console.log(eml);
    dbCon.query("select * from medsavailable where email =?",[eml],function(err,result){
        if(err==null)
        {
            // console.log(result);
            resp.send(result);
        }
        else{
            resp.send(err);
        }
    })
})
app.get("/delete-med",function(req,resp){
    // console.log(req.query.email);
    var srno=req.query.Srno;
    console.log(srno);
    dbCon.query("delete from medsavailable where srno =?",[srno],function(err,result){
        if(err==null)
        {
            // console.log(result);
            resp.send(result);
        }
        else{
            resp.send(err);
        }
    })
})
app.get("/find-city",function(req,resp){
    dbCon.query("Select distinct city from donors",function(err,table){
        if(err==null){
            resp.send(table);
        }
        else{
            resp.send(err);
        }
    })
})
app.get("/find-meds",function(req,resp){
    dbCon.query("Select distinct med from medsavailable",function(err,table){
        if(err==null){
            resp.send(table);
            // console.log(table);
        }
        else{
            resp.send(err);
        }
    })
})
// 
app.get("/find-donor",function(req,resp){
{
//   console.log(req.query);
  var med=req.query.medkuch;
  var city=req.query.citykuch;

//   console.log(med);
//   console.log(city);
  

  dbCon.query("select donors.email,donors.name,donors.mobile,donors.address,donors.city,donors.afrom,donors.ato,donors.gender,medsavailable.med from donors inner join medsavailable on donors.email=medsavailable.email where medsavailable.med=? and donors.city=?",[med,city],function(err,resultTable)
  {
  if(err==null){
    resp.send(resultTable);
    // console.log(JSON.stringify(resultTable));
}
  else
    resp.send(err); 
  })
}
})