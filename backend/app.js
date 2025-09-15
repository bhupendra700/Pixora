const express = require("express");
const dotenv = require("dotenv");
dotenv.config()
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const fs = require("fs")
const Collection = require("./Models/Collection.js");
const mongoose = require("mongoose");
const axios = require("axios");
const FormData = require("form-data");


const origin = ["https://pixorafree.netlify.app"];
app.use(cors({ origin }))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//multer diskStorage setup
const upload = multer({ dest: "uploads" });

//cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY,
})

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!!!");
    } catch (err) {
        console.error("MongoDB Error:", err.message);
    }
};

connectDB();

app.get('/', (req, res) => {
    return res.send("hello world");
})

app.post('/upload', upload.single("sendfile"), async (req, res) => {
    try {
        const filePath = req.file.path;

        const { photoURL } = req.body;

        const publicId = JSON.parse(photoURL)?.public_id || "";

        const options = {}

        if (publicId) {
            options.public_id = publicId;
            options.overwrite = true;
        } else {
            options.folder = "UserImage";
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(filePath, options)

        fs.unlinkSync(filePath);

        return res.status(200).json({ public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.url });

    } catch (error) {
        return res.status(404).send(error.message);
    }
})

//this is deleting
app.put('/delete', async (req, res) => {
    try {
        const { publicId } = req.body
        await cloudinary.uploader.destroy(publicId)
        res.status(200).send("Ok")
    } catch (error) {
        return res.status(404).send(error.message);
    }
})

app.post('/text-to-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        const formData = new FormData()
        formData.append("prompt", prompt);

        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer"
        })

        const buffer = Buffer.from(data);
        let base64Image = buffer.toString("base64");

        return res.json({ success: true, message: "Image generated successfully", image: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false, message: error.message })
    }
})

app.post('/creativeimage', async (req, res) => {
    try {
        const { image } = req.body;

        const ImageBuffer = Buffer.from(image, 'base64');

        const formData = new FormData();
        formData.append("image_file", ImageBuffer, { filename: 'image.png' });

        const { data } = await axios.post("https://clipdrop-api.co/reimagine/v1/reimagine", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer"
        })

        let buffer = Buffer.from(data);

        let base64Image = buffer.toString("base64");

        return res.json({ success: true, message: "Image generated successfully", image: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false, message: error.message })
    }
})

app.post("/changebackground", async (req, res) => {
    try {
        const { prompt, image } = req.body;

        const ImageBuffer = Buffer.from(image, 'base64');

        const formData = new FormData();
        formData.append("image_file", ImageBuffer, { filename: 'image.png' });
        formData.append('prompt', prompt)

        const { data } = await axios.post("https://clipdrop-api.co/replace-background/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer"
        })

        let buffer = Buffer.from(data);
        let base64Image = buffer.toString("base64");

        return res.json({ success: true, message: "Image generated successfully", image: `data:image/png;base64,${base64Image}` });
    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/uploadimage', async (req, res) => {
    try {
        const { base64Image, userId } = req.body;
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: userId,
        });

        const obj = {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height
        }

        const resDB = await Collection.findOneAndUpdate({
            _id: userId,
        }, { $push: { collection: obj } }, { upsert: true, new: true })

        return res.json({ success: true, message: "Collection save successfully", collection: resDB.collection[resDB.collection.length - 1] })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
})

app.delete('/deleteimage/:userId/:public_id', async (req, res) => {
    try {
        const { public_id, userId } = req.params;

        await Collection.updateOne({ _id: userId }, { $pull: { collection: { public_id } } })

        await cloudinary.uploader.destroy(public_id);

        return res.json({ success: true, message: "Image deleted successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
})

app.delete('/deleteFolder/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        await cloudinary.api.delete_resources_by_prefix(`${userId}/`);

        await cloudinary.api.delete_folder(userId);

        await Collection.deleteOne({ _id: userId });

        return res.json({ success: true, message: "Image deleted successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
})

app.get('/getcollection/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            throw new Error("This is an error");
        }

        const userData = await Collection.findOne({ _id: userId }).lean();

        return res.json({ success: true, message: "Collection fetched successfully", collection: userData.collection });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
})

app.listen(port, () => {
    console.log("Server is started listening");
})
