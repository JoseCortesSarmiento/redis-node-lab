const express = require("express");
const axios = require("axios");
const redis = require("redis");

const app = express();
//const cors = require("cors");

//app.use(cors());

//redis
const redisPort = 6379;
//const client = redis.createClient(redisPort);
const client = redis.createClient({host: '34.71.227.51', port: redisPort});

client.on("error", (err) => {
	console.log(err);
})

//endredis

app.get("/emails", async(req,res) => {
	try{
		client.get(1,async(err,people) => {
			if(err) throw err;

			if(people){
				res.status(200).send({
					people: JSON.parse(people),
					message: "data retrieven from the REDIS cache"
				});
			}
			else {
				const people = await axios.get(`http://34.71.227.51:8145/api/auth/emails`);
				client.setex(1,600,JSON.stringify(people.data));
				res.status(200).send({
					people: people.data,
					message: "cache miss, data from REST-API"
				});
			}

		});
	} catch (err) {
		res.status(500).send({message: err.message});
	}
});

app.listen(process.env.PORT || 8162, () => {
	console.log("Node server started");
});

//redis
//const redisPort = 6379
//localhost
//const client = redis.createClient(redisPort);
//class
//const client = redis.createClient({host: '35.232.232.192', port: redisPort});

//client.on("error", (err) => {
//	console.log(err);
//})

//app.get("/jobs", async (req, res) => {
//	const searchTerm = req.query.search;
//	console.log(searchTerm);
//	try {
     //   client.get(searchTerm, async (err, jobs) => {
   //         if (err) throw err;
    
            //if (jobs) {
            //    res.status(200).send({
          //          jobs: JSON.parse(jobs),
        //            message: "data retrieved from the cache"
      //          });
    //        }
  //          else {
//                const jobs = await axios.get(`https://jobs.github.com/positions.json?search=${searchTerm}`);
                //client.setex(searchTerm, 600, JSON.stringify(jobs.data));
               // res.status(200).send({
              //      jobs: jobs.data,
            //        message: "cache miss"
          //      });
        //    }
      //  });
    //} catch(err) {
    //    res.status(500).send({message: err.message});
  //  }
//});

//local
//app.listen(process.env.PORT || 8085, () => {
//	console.log("Node server started: 8085");
//});

//class
//app.listen(process.env.PORT || 8162, () => {
	//console.log("Node server started: 8085");
//});
