require("dotenv").config();
console.log("ENV:", process.env.ATLAS_URI);


const express = require("express");//express import
const mongoose = require("mongoose");//mongoose import
const app = express();//express app init
const path = require("path");//
const engine = require("ejs-mate");//ye wla add kr ejs ko layout support krwa rha h
const methodOverride = require("method-override");//
const ExpressError = require("./utils/Expresserr");
const sessions = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");//listing routes import
const reviewsRouter = require("./routes/review.js");//review routes import
const userRouter = require("./routes/user.js");


app.use(methodOverride('_method'));//method override middleware
app.set("view engine", "ejs");//ejs set as view engine kammand
app.set("views", path.join(__dirname, "views"));// ye line views folder ka path set kr rha h
app.use(express.static(path.join(__dirname, "public")));//static files k liye public folder set kr rha h
app.use(express.urlencoded({ extended: true }));// ye middleware form data ko read krne k liye h
app.engine("ejs", engine);//ye line ejs-mate ko use krne k liye h


const dbUrl = process.env.ATLAS_URI;

main().then((res) => {
    console.log("The mongoose dB connected");
}).catch(err => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
    console.log("Session store error", e);
});

const sessionOptions = {
    store: store,
    secret: "mysecrethasini",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};




app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {   // middle ware for the flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;  // may be you thinking about user in passport user information is strong 
    res.locals.MAP_TOKEN = process.env.MAP_TOKEN;


    next();
})

app.get("/demouser", async (req, res) => {
    let fakeuser = new User({
        email: "dnsd@gmail.com",
        username: "delta-IRH",
    });
    let registerUser = await User.register(fakeuser, "helloworld");  //register is mathod visit the DC

    res.send(registerUser);
})







app.use("/listings", listingsRouter);//listing routes use kr rha h
app.use("/listings/:id/reviews", reviewsRouter);//review routes use kr rha h
app.use("/", userRouter);




//test

// app.get("/testing", async (req, res) => {
//     let firstinsert = listing({
//         title: "Are you ready...",
//         description: "You will do well",
//         price: 2000,
//         location: "Nellore",
//         country: "India",
//     });
//     await firstinsert.save().then((res) => {
//         console.log(res);
//     }).catch(err => {
//         console.log(err);
//     });
//     res.send("hey....");
// });
app.use((req, res, next) => {
    next(new ExpressError("Page is not found", 404));

});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    if (res.headersSent) {
        return next(err);   // ✅ prevents crash
    }

    res.status(statusCode).render("err.ejs", { message });
});
app.listen(8080, () => {
    console.log("server is working");
});