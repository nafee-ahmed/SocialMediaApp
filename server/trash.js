// app.post('/signup', async (req, res, next) => {
//     const {name, number, email, password} = req.body;
//     try{
//         const hashedPw = await bcrypt.hash(password, 12);
//         const user = new User({name, number, email, password: hashedPw});
//         await user.save();
//         const token = user.getSignedToken();
//         res.status(200).json({success: true, token});
//     }
//     catch(e){
//         next(e);
//     }
// })

// app.post('/login', async (req, res, next) => {
//     const {email, password} = req.body;
//     try {
//         const user = await User.findOne({email});
//         if(!user) throw new AppError('Wrong Credentials', 401);
//         const result = await bcrypt.compare(password, user.password);
//         if(result){
//             const token = user.getSignedToken();
//             res.status(200).json({success: true, token});
//         } else {
//             throw new AppError('Wrong Credentials', 401);
//         }
//     } catch (err) {
//         next(err);
//     }
// })







// app.post('/post/add', protect, async (req, res, next) => {
//     try {
//         let finalImg;
//         if(req.body.image){
//             const image = req.body.image;
//             const uploadedResponse = await cloudinary.uploader.upload(image, {
//                 upload_preset: `${process.env.CLOUDINARY_UPLOAD_PRESET}`
//             });
//             finalImg = uploadedResponse.url;      
//         }
//         else{
//             finalImg = undefined;
//         }
//         const text = req.body.postCaption || undefined;
//         const post = new Post({text, image: finalImg});
//         post.user = req.user;
//         await post.save();
//         res.status(201).json({success: true, msg: req.body});
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// })
// app.post('/post/profile/read', protect, async (req, res, next) => {
//     console.log('user', req.user._id);
//     try {
//         const posts = await Post.find({user: req.user._id}).populate('user').sort({ _id: -1 });
//         // console.log('posts', posts[0].user[0].name);
//         res.status(201).json({success: true, posts})
//     } catch (err) {
//         console.log(err);
//         next(err);
//     }
// })
