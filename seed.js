const { db, Gardener, Plot, Vegetable } = require("./models");

const vegetables = [
  {
    name: "Carrot",
    color: "Orange",
    planted_on: Date.now(),
  },
  {
    name: "Brocolli",
    color: "Green",
    planted_on: Date.now(),
  },
  {
    name: "Corn",
    color: "Yellow",
    planted_on: Date.now(),
  }
];

const gardeners = [
   {
     name: "Matthew",
     age: 20,
   },
   {
     name: "Kat",
     age: 30,
   },
   {
     name: "John",
     age: 25,
   },
];

const plots = [
   {
     size: 120,
     shaded: true,
   },
   {
     size: 150,
     shaded: true,
   },
   {
     size: 130,
     shaded: true,
   },
];

// This will make you appreciate async/await along with try, catch
// To make this into an async/await operation, just put all of this code in one function with a try catch block, and make sure to db.sync on the top and db.close on the bottom
// then call the function down at the bottom.

// Nature of .sync method: if option force is set equal to true, the it will drop all tables on every startup and create new ones. This is a viable
// option only for development/testing ! 
// .sync by default will create all of the tables in the database that's been defined in a application
// Generally, they will be called only once in the server.js file, but if you're handling multiple databases, then of course you'll need more calls.

const synced = db.sync({ force: true });

synced.then(() => {
   // these are all asynchronous operations: bulkCreate returns a promise and holds an array of instances
   const promiseVegetables = Vegetable.bulkCreate(vegetables ,{ returning: true });
   const promiseGardeners = Gardener.bulkCreate(gardeners, { returning: true });
   const promisePlots = Plot.bulkCreate(plots, { returning: true });
   
   // Promise.all resolves all the passed in promises into an array of values: an 
   // iterable of promises
   // it returns a new promise that contains that array
   return Promise.all([promiseVegetables, promiseGardeners, promisePlots]);
}).then(values => {
   // values is an array that holds array of instances
   const [vegetableRows, gardenerRows, plotRows] = values;
   
   // carrot: first instance, corn: second instance, spinach: third instance from array of instances (vegetableRows)
   const [carrot, brocolli, corn] = vegetableRows;
   
   // analogous to above
   const [Matthew, Kat, John] = gardenerRows;
   const [plot1, plot2, plot3] = plotRows;

   const promiseMatthew = Matthew.setFavorite_vegetable(carrot);
   const promiseMatthew2 = Matthew.setPlot(plot1);

   const promiseKat = Kat.setFavorite_vegetable(brocolli);
   const promiseKat2 = Kat.setPlot(plot2);

   const promiseJohn = John.setFavorite_vegetable(corn);
   const promiseJohn2 = John.setPlot(plot3);
   
   // handles many-to-many association
   const promiseJunction = carrot.addPlot(plot1);
   const promiseJunction2 = brocolli.addPlot(plot2);
   
   // resolve all of these promises
   return Promise.all([promiseMatthew, promiseMatthew2, promiseKat, promiseKat2, promiseJohn, promiseJohn2, promiseJunction, promiseJunction2]);
}).then(() => {
   console.log("Database succesfully created");
}).catch(err => {
   console.log('Disaster something went wrong');
   console.log(err.message);
})
.finally(() => {
    db.close();
});
