const Twitter = require("twitter");
require("dotenv").config();

async function main () {

    const twitter = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

    try {
        console.log("[INFO] Fetching following list.");
        // get array of following, about 2,500 user ids
        let res = await twitter.get("friends/ids", {screen_name: "AhmadIbnRachid", stringify_ids: true})

        // Split this array into sub arrays of 100
        let userIds = res.ids;
        let arrayOf100 = [];
        
        console.log("[INFO] Creating arrays of user ids.");
        while (userIds.length > 0) {
            let tempArray = userIds.splice(0, 100);
            arrayOf100.push(tempArray);
        };

        // define the date to be reused for each analysis
        let now = new Date();
        const last_year = now.setFullYear(now.getFullYear() - 1);

        // Analyze each sub array of 100 users for user who haven't tweeted in a year
        console.log("[INFO] Analyzing users for tweet activity.");
        while (arrayOf100.length > 0) {
            let current100 = arrayOf100.pop();
            let users = await twitter.get("users/lookup", {user_id: current100.join(",")});
            
            // check statuses dates
            for (let i = 0; i < users.length; i++) {
                if (!users[i].status) {
                    // if there is no status available, it indicates user hasn't tweeted.
                    console.log(`[INFO] ${users[i].screen_name} hasn't tweeted. `);
                } else {
                    let tweet_date = new Date(users[i].status.created_at);
                    // compare if the tweet is from the last year. 
                    if (tweet_date < last_year) {
                    // here the delete action would take place. 
                    console.log(`[INFO] ${users[i].screen_name} hasn't tweeted since ${users[i].status.created_at}`);
                    //let unfollow = await twitter.post("friendships/destroy", {user_id: res.ids[i]});
                    //console.log(`You have unfollowed ${unfollow.screen_name}`);
                }
                }
            }
            
        }
    } catch (e) {
        console.log(e);
    }
}

main();
