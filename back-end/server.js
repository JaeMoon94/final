const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const argon2 = require("argon2")

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// connect to the database
mongoose.connect('mongodb://localhost:27017/blackjack', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});


// Create a scheme for users
const profileSchema = new mongoose.Schema({
  username: String,
  balance: Number,
  wins: Number,
  losses: Number,
  ties: Number,
  totalDeposited: Number,
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    contact: String,

  });

userSchema.pre('save', async function(next) {
// only hash the password if it has been modified (or is new)
if (!this.isModified('password'))
    return next();

try {
    // generate a hash. argon2 does the salting and hashing for us
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    next();
} catch (error) {
    next(error);
}
});

userSchema.methods.comparePassword = async function(password) {
    try {
      // note that we supply the hash stored in the database (first argument) and
      // the plaintext password. argon2 will do the hashing and salting and
      // comparison for us.
      const isMatch = await argon2.verify(this.password, password);
      return isMatch;
    } catch (error) {
      return false;
    }
  };

  userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  }

// Create a model for users
const Profile = mongoose.model('Profile', profileSchema);
const User = mongoose.model('User', userSchema);



app.post('/api/users', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // passsword, otherwise return an error. A 400 error means the request was
    // malformed.

    if (!req.body.username || !req.body.password)
      return res.status(400).send({
        message: "username and password are required"
      });
  
    try {
  
      //  Check to see if username already exists and if not send a 403 error. A 403
      // error means permission denied.
      const existingUser = await User.findOne({
        username: req.body.username
      });
      if (existingUser)
        return res.status(403).send({
          message: "username already exists"
        });
  
      // create a new user and save it to the database
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        contact : req.body.contact,
        eamil : req.body.email
      });
      await user.save();
      // send back a 200 OK response, along with the user that was created
      const profile = new Profile({
        username: req.body.username,
        balance: 0,
        wins: 0,
        ties: 0,
        losses: 0,
        totalDeposited: 0
      });
      await profile.save()
      return res.send({
        user: user,
        profile: profile
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  });

  app.post('/api/users/login', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    if (!req.body.username || !req.body.password)
      return res.sendStatus(400);
  
    try {
      //  lookup user record
      const user = await User.findOne({
        username: req.body.username
      });
      const profile = await Profile.findOne({
        username: req.body.username
      })
      // Return an error if user does not exist.
      if (!user)
        return res.status(403).send({
          message: "username or password is wrong"
        });
  
      // Return the SAME error if the password is wrong. This ensure we don't
      // leak any information about which users exist.
      if (!await user.comparePassword(req.body.password))
        return res.status(403).send({
          message: "username or password is wrong"
        });
  
      return res.send({
        user: user,
        profile: profile
      });
    } catch (error) {
      return res.sendStatus(500);
    }
  });


// Get a list of all of the users
app.get('/api/users', async (req, res) => {
  try {
    let profiles = await Profile.find();
    res.send(profiles);
  } catch (error) {
    res.sendStatus(500);
  }
});


app.delete('/api/users/:username', async (req, res) => {
  try {
    await User.deleteOne({
      username: req.params.username
    });
    await Profile.deleteOne({
        username: req.params.username
    })
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.put('/api/users/:username', async (req,res) => {
  try {
    user = await User.findOne({
      username: req.params.username
    });
    profile = await Profile.findOne({
        username: req.params.username
    });
    if (req.body.username) {
        user.username = req.body.username;
        profile.username = req.body.username;
    }
    if (req.body.password) {
        user.password = req.body.password
    }
    if (req.body.wins == 0 || req.body.wins) {
        profile.wins = req.body.wins;
    }
    if (req.body.losses == 0 || req.body.losses) {
        profile.losses = req.body.losses;
    }
    if (req.body.ties == 0 || req.body.ties) {
        profile.ties = req.body.ties;
    }
    if (req.body.balance == 0 || req.body.balance) {
        profile.balance = req.body.balance
    }
    if (req.body.totalDeposited == 0 || req.body.totalDeposited) {
        profile.totalDeposited = req.body.totalDeposited
    }
    user.save()
    profile.save()
    res.send({
        user: user,
        profile: profile
      });
  } catch(error) {
    res.sendStatus(500)
  }
});


app.listen(3004, () => console.log('Server listening on port 3004!'));
