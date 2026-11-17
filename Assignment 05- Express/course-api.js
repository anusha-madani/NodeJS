const express = require ("express");
const myapp = express();

const courses =[
  { id: 1, title: "HTML Basics", level: "beginner", hours: 10 },
  { id: 2, title: "JavaScript Essentials", level: "beginner", hours: 20 },
  { id: 3, title: "Node.js Server", level: "intermediate", hours: 24 },
  { id: 4, title: "Advanced MongoDB", level: "advanced", hours: 30 },

];

// home page
myapp.get ("/", (req, res) =>{
    res.send ("<h1>COURSES myapps</h1>");
});

// about page
myapp.get("/about", ( req, res) =>{
    res.type("text/plain").send ("Course myapp v1- built with Express");
});

//all courses
myapp.get ("/api/courses", (req,res) => {
    const q = req.query.level;
    if(q){
        const filtered = courses.filter((c) => c.level === level);
        return res.json(filtered);
    }
    res.json(courses);
});

// courses by id
myapp.get ("/api/courses/:id", (req,res) =>{
    const course = courses.find((c) => c.id === Number(req.params.id));
    if(!course){
        return res.status(404). json({
            error:"not found"
        });
    }
    res.json(course);
});

// route and query param
myapp.get("/api/greet/:name", (req,res)=>{
    const name = req.params.name;
    const city = req.query.city || "pakistan";
    res.json({
        message: `hello ${name} from ${city}`
    });
});

//numbers validations
myapp.get ("/api/add/:a/:b", ( req , res) => {
    const A = Number (req.params.a);
    const B = Number (req.params.b);

    if (Number.isNaN(A) || Number.isNaN(B)){
        return res.status(400).json({
            error: "a and b must be a numbers"
        });
    }
    res.json({ a: A, b: B, sum: A + B});

});

myapp.use((req, res ) =>{
    res.status(404).json ({
        error:"route not found"
    });

});

myapp.listen(3000, () =>{
    console.log("server running at http://localhost:3000" );
})
