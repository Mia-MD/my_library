import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const PORT = 3000;
const API_URL = "https://kitsu.io/api/edge";

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"booknotes",
    password:"w3b_D3v*$",
    port:5433
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

db.connect();

let sortType = "default";

app.get("/",async (req,res)=>{
    let result="";
    try{
        switch(sortType){
            case "default":
                result = await db.query("SELECT * FROM mangas ORDER BY id ASC");
                break;
            case "date":
                result = await db.query("SELECT * FROM mangas ORDER BY date DESC");;
                break;
            case "rating":
                result = await db.query("SELECT * FROM mangas ORDER BY rating DESC");
                break;
        }
        const allManga = result.rows;
        res.render("home.ejs",{
            mangas:allManga,
        })
    }catch(error){
        console.log("error");
    }
});

app.get("/addManga",(req,res)=>{
    res.render("addNotes.ejs");
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.get("/:title",async(req,res)=>{
    const title = req.params.title;
    try{
        const result = await db.query("SELECT * FROM mangas WHERE title=$1",[title]);
        const manga = result.rows[0];
        res.render("entry.ejs",{manga:manga});
    }catch(error){
        console.log("Error finding blog");
    }
});

app.post("/sort",(req,res)=>{
    sortType = req.body.sort.toLowerCase();
    console.log(sortType);
    res.redirect("/");
});

app.post("/add",async(req,res)=>{
    const newEntry = {
        title: req.body.title,
        date: req.body.date,
        rating: req.body.rating,
        summary: req.body.summary,
        notes: req.body.notes
    }
    try{
        const result = await axios.get(`${API_URL}/manga?filter[text]=${newEntry.title.toLowerCase()}`);
        const image = result.data.data[0].attributes.posterImage.original;
        newEntry.image = image;
        await db.query("INSERT INTO mangas(title,date,rating,summary,notes,image) VALUES($1,$2,$3,$4,$5,$6)",
            [newEntry.title,newEntry.date,newEntry.rating,newEntry.summary,newEntry.notes,newEntry.image]);
    }catch(error){
        console.log(error);
    }
    
    res.redirect("/");
});

app.post("/delete",async (req,res)=>{
    const entryDelete = req.body.deleteEntryId;
    try{
        await db.query("DELETE FROM mangas WHERE id=$1",[entryDelete]);
        
    }catch(error){
        console.log(error);
    }
    res.redirect("/");
});

app.post("/edit",async(req,res)=>{
    const newDate = req.body.updatedDate;
    const newRating = req.body.updatedRating;
    const newSummary = req.body.updatedSummary;
    const newNotes = req.body.updatedNotes;
    const id = req.body.id;
    try{
        await db.query("UPDATE mangas SET date=$1,rating=$2,summary=$3,notes=$4 WHERE id=$5",
            [newDate,newRating,newSummary,newNotes,id]
        );
    }catch(error){
        console.log("error editing");
    }
    res.redirect("/");

});

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
});