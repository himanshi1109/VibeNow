import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = 'mongodb+srv://admin_user:eventvibe123@vibenow-cluster.lge1ev5.mongodb.net/VibeNow?appName=VibeNow-Cluster';

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
    credits: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

mongoose.connect(MONGO_URI)
  .then(async () => {
    let admin = await User.findOne({ email: 'admin@vibenow.com' });
    if (!admin) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('admin123', salt);
        admin = await User.create({
            name: "Main Admin",
            email: "admin@vibenow.com",
            phone: "0000000000",
            password: hashedPassword,
            isAdmin: true,
            isActive: true,
            credits: 9999
        });
        console.log("Admin created!");
    } else {
        console.log("Admin already exists!");
    }
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
