import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/database.js';
dotenv.config();


await connectDB();
let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
