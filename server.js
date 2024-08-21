const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const app = express();
const PORT = 3002;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'credentials',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
mongoose.connect('mongodb://localhost:27017/credentials', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Database connection error:', err));
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favouriteDish: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);
app.use(express.static(__dirname));
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, favouriteDish } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        favouriteDish
      });
      await newUser.save();
      req.session.userName = firstName; 
      res.redirect('/index.html');
    } catch (err) {
      console.error('Registration Error:', err.message);
      res.status(500).send('Error registering user.');
    }
  });
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error logging out:', err);
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/index.html'); 
  });
});
app.get('/user', (req, res) => {
  res.json({ userName: req.session.userName || 'Guest' });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});