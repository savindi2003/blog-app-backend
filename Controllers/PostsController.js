const mongoose = require("mongoose");
const Blog = require("../Model/PostModel");
const { upload } = require("../config/cloudinary"); // multer middleware

// Add new blog
const addBlog = async (req, res) => {
    try {
        const { title, content, author, category, tags } = req.body;

        const file = req.file;

        if (!file) return res.status(400).json({ message: "Cover image is required" });


        if (!author || !mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }


        const blog = new Blog({
            title,
            content,
            author,
            category,
            tags: tags.split(",").map(t => t.trim()),
            coverImage: file.path, // multer-storage-cloudinary automatically uploaded and path is the Cloudinary URL
            published: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await blog.save();

        return res.status(201).json({ message: "Blog created successfully", blog });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating blog" });
    }
};

//get all blog list
const getAllBlogs = async (req, res, next) => {

    let blogs;

    try {
        blogs = await Blog.find()
        .sort({ createdAt: -1 })
        .populate("author","username profilePic")
        
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blogs not found" })
    }

    return res.status(200).json({ blogs })

}

//search by id
const getById = async (req, res, next) => {
    const id = req.params.id;

    let blogs;

    try {
        blogs = await Blog.findById(id)
        .populate("author","username profilePic")
        .populate({
                path: 'comments', 
                populate: {
                    path: 'userId', 
                    select: 'username profilePic' 
                }
            });
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blogs not found" })
    }

    return res.status(200).json({ blogs })

}

//search by title
const getByTitle = async (req, res, next) => {
    const title = req.params.title;

    let blogs;

    try {
        blogs = await Blog.find({
            title: { $regex: title, $options: "i" }
        })
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blogs not found" })
    }

    return res.status(200).json({ blogs })

}

//search by category
const getByCategory = async (req, res, next) => {
    const category = req.params.category;

    let blogs;

    try {
        blogs = await Blog.find({
            category: { $regex: title, $options: "i" }
        })
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blogs not found" })
    }

    return res.status(200).json({ blogs })

}

//sort by  oldest to new
const getAllBlogsSort = async (req, res, next) => {

    let blogs;

    try {
        blogs = await Blog.find().sort({ createdAt: 1 });
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Blogs not found" })
    }

    return res.status(200).json({ blogs })

}

//update blog
const updateBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        const { title, content, category, tags } = req.body;
        const file = req.file; // multer-storage-cloudinary path = Cloudinary URL

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        // Find existing blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Update fields
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (tags) blog.tags = tags.split(',').map(t => t.trim());
        if (file) blog.coverImage = file.path; // Cloudinary URL
        blog.updatedAt = new Date();

        await blog.save();

        return res.status(200).json({ message: "Blog updated successfully", blog });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating blog" });
    }
};

//delete blog
const deleteBlog = async (req, res, next) => {

    const id = req.params.id
    let blogs;

    try {
        blogs = await Blog.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
    }

    if (!blogs) {
        return res.status(404).json({ message: "Unable to delete blog" })
    }

    return res.status(200).json({ blogs })

}

//update like

const updateLikes = async (req, res, next) => {
    const id = req.params.id;
    const userId = new mongoose.Types.ObjectId(req.body.userId);

    let blogs;

    try {
        blogs = await Blog.findById(id);

        if (!blogs) {
            return res.status(404).json({ message: "Blog not found" })
        }

        if (blogs.likes.includes(userId)) {
            blogs.likes.pull(userId)
        } else {
            blogs.likes.push(userId)
        }

        await blogs.save();
        return res.status(200).json({
            message: "Like updated",
            likesCount: blogs.likes.length,
            likes: blogs.likes
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const User = require('../Model/UserModel')
const getByAuthor = async (req, res) => {
    const { id } = req.params;  // <-- change from authorId to id
    const authorId = id;        // optional, just for clarity

    try {
        const author = await User.findById(authorId)
            .select("username profilePic bio");

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        const blogs = await Blog.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate("author", "username profilePic"); 

        return res.status(200).json({ author, blogs });

    } catch (error) {
        console.error("Error in getByAuthor:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getRelatedBlogs = async (req, res) => {
    const { currentId } = req.params; // current blog id

    try {
        const blogs = await Blog.find({ _id: { $ne: currentId } }) // exclude current post
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("author", "username profilePic");

        return res.status(200).json({ blogs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.getAllBlogs = getAllBlogs
exports.addBlog = addBlog
exports.getById = getById
exports.getByTitle = getByTitle
exports.getByCategory = getByCategory
exports.getAllBlogsSort = getAllBlogsSort
exports.updateBlog = updateBlog
exports.deleteBlog = deleteBlog
exports.updateLikes = updateLikes
exports.getByAuthor = getByAuthor
exports.getRelatedBlogs = getRelatedBlogs
