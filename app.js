const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

//
const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
//mongoose connection structure and collections
mongoose.connect("mongodb://127.0.0.1:27017/Feedback");
mongoose.set('strictQuery', false);

const postSchema = {
    title: String,
    content: String
};
const Post = mongoose.model("Post",postSchema);




const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.";
const contactContent = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";





app.get("/",function(req,res){
    Post.find({}).then(function(posts){
        res.render("home",{homeStartingContent:homeStartingContent,posts:posts})
    }).catch(function(err){
        if (err){
            console.log(err);
        }
    });
});


app.get("/contact",function(req,res){

    res.render("contact",{contactcontent:contactContent});
});

app.get("/about",function(req,res){
    res.render("about",{aboutcontent:aboutContent});
});
app.get("/compose",function(req,res){
  
    
    res.render("compose");
});

app.get("/:postId",function(req,res){

    
    const requested_id = req.params.postId;
    let x = false;
    Post.find({}).then(function(posts){
        posts.forEach(function(item){
            const postedId = item._id;
            console.log(requested_id + " ++++" + postedId);
            if (requested_id == postedId){
                
                res.render("empty",{title:item.title,content:item.content});
                x = true;
            }
            
        });
        if (!x){
        res.redirect("/");}
        
       
      
    }).catch(function(err){
        console.log(err);
    });
    
});

app.post("/delete",function(req,res){
    const deleteitem = req.body.deleteItem;
    
    Post.findByIdAndRemove(deleteitem).then(function(){
        console.log("data deleted from database successfully");
        res.redirect("/");
    }).catch(function(err){
        console.log(err);
    });
})

// app.get("/:postName",function(req,res){
    
    
//     const Requested_id = req.params.postName;
//     console.log(Requested_id);
    
//     let x = false;

//     Post.find({}).then(function(posts){
//         posts.forEach(function(item){
//             const Posted_id = item._id;
//             console.log("----"+Posted_id);
//             if (Requested_id == Posted_id){
                
//                 res.render("empty",{title:item.title,content:item.content});
//                 x = true;
//             }
//         });
//         if (!x){
//         res.redirect("/");
//         }
//     }).catch(function(err){
//         console.log(err);
//     });



// });



//post routs

    app.post("/compose",function(req,res){
        
        

        const post = new Post({
            title:req.body.postTitle,
            content:req.body.postBody

        });
        post.save();
        res.redirect("/");

    });






// app.post("/delete",function(req,res){
//     const postId = req.body.deleteItem;
//     console.log(postId)
//     Post.findByIdAndRemove(postId).then(function(){
//         console.log("the data deleted successfully");
//         res.redirect("/");
//     }).catch(function(err){
//         console.log(err);
//     });
// });



app.listen("3000",function(req,res){
    console.log("the server is listening ");
});



