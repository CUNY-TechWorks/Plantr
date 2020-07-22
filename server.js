const express = require("express");
const morgan = require("morgan");
const html = require("html-template-tag");
const { Gardener, Plot, Vegetable } = require("./models");

// create web server
const app = express();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }))

app.get("/", (req,res,next) => {
   res.redirect("/gardeners");
});

app.get("/gardeners", async (req,res,next) => {
  try {
   const gardeners = await Gardener.findAll({
       attributes: ['name', 'id'],
   });

   const text = html `<!DOCTYPE html>
      <html lang=en>
        <head>
          <title> Gardeners and their plots </title>
        </head>
        <body>
           <div>
               <span> List of gardeners: </span>
               <ul>
                  ${gardeners.map(gardener => {
                      return `<li> ${gardener.name} <a href="/gardeners/${gardener.id}"> details </a> </li> <hr>`
                  })}
               </ul>
           </div>
        </body>
      </html>
   `;

   res.send(text);
  }
  catch(err) {
      console.log(err.message)
  }
});

app.get("/gardeners/:id", async (req,res,next) => {
  try {
    const gardener = await Gardener.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Plot,
            where: {
                gardenerId: req.params.id,
            }
        },
    });

    const favVegetable = await gardener.getFavorite_vegetable();
    
    const text = html `<!DOCTYPE html>
       <html lang=en>
        <head>
          <title> Gardeners and their plots </title>
        </head>
        <body>
           <div>
               <span> ${gardener.name}'s plot size and favorite vegetable: </span>
               <ul>
                  <li> Plot size: ${gardener.plot.size} </li>
                  <li> Favorite vegetable: ${favVegetable.name} </li>
               </ul>
           </div>
           <div>
              <a href="/gardeners"> home </a>
           </div>
        </body>
      </html>
    `;

    res.send(text);
  }
  catch(err) {
    console.log(err.message);
  }
})

const port = 1337;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})