import {User}from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res) =>{
  try {
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(401).json({
            msg:"something is missing , plz check!",
            success:false,
        });
    }
    const user = await User.findOne({email});
    if(user){
        return res.status(401).json({
            msg:"try with different email id.",
            success:false,
        })
    };
    const hashedPass = await bcrypt.hash(password,10);
    await User.create({
        username,
        email,
        password : hashedPass
    });
    return res.status(201).json({
            msg:"Account created successfully",
            success:true,
        })
  } catch (e) {
    console.log(e);
  }
}



export const login = async(req,res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password){
         return res.status(401).json({
            msg:"something is missing , plz check!",
            success:false,
         });
        }
        let user =await User.findOne({email});
       if(!user){
        return res.status(401).json({
            msg:"Incorrect email or password",
            success:false,
        })
       };
       const isPassMatch = await bcrypt.compare(password,user.password);
       if(!isPassMatch){
        return res.status(401).json({
            msg:"Incorrect email or password",
            success:false,
        })
       }

       user = {
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePicture:user.profilePicture,
        bio:user.bio,
        followers:user.followers,
        followings:user.followings,
        posts:user.posts
       }

     const token = await jwt.sign({userId : user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
     return res.cookie('token',token,{httpOnly:true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({
        msg:`Welcome ${user.username}`,
        success:true,
        user
     })

    } catch (error) {
        console.log(error)
    }
}


export const logout = async(_,res)=>{
  try {
    return res.cookie("token","",{maxAge:0}).json({
         msg:"logged out successfully",
        success:true,
    })
  } catch (error) {
     console.log(error)
  }
}


export const getProfile = async(req,res)=>{
  try {
    const userId = req.params.id;
    let user = await User.findOne(userId);
    return res.status(200).json({
        user,
        success:true
    })
    
  } catch (error) {
     console.log(error)
  }
}


export const editProfile = async(req,res)=>{
  try {
     const userId = req.id;
     const {bio,gender}=req.body;
     const profilePicture=req.file;
     let cloudResponse;

     if(profilePicture){
        const fileUri = getDataUri(profilePicture);
        cloudResponse=await cloudinary.uploader.upload(fileUri);
     }
     
     const user = await User.findById(userId);
     if(!user){
        return res.status(404).json({
            msg:"user not found",
            success: false
        })
     }
     if(bio) user.bio= bio;
     if(gender) user.gender= gender;
     if(profilePicture) user.profilePicture= cloudResponse.secure_url;

     await user.save();

     return res.status(200).json({
            msg:"profile updated",
            success: true,
            user
        })
    
  } catch (error) {
     console.log(error)
  }
}


export const getsuggestedUsers = async(req,res)=>{
  try {
     const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
     if(!suggestedUsers){
        return res.status(400).json({
            msg:"currently do not have any users"
        })
     }
     return res.status(200).json({
            success:true,
            users:suggestedUsers
        })

    
  } catch (error) {
     console.log(error)
  }
}


export const followOrUnfollow = async (req,res) =>{
    try {
        const followKrneWala = req.id;
        const jiskoFollowkrugi = req.params.id;
        if(followKrneWala===jiskoFollowkrugi){
             return res.status(400).json({
              msg:"uhh cannot follow/unollow yourself",
              success:false
         })

        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowkrugi);

        if(!user || !targetUser){
            return res.status(400).json({
            msg:"user not found",
            success:false
        })
        }

        const isFollowing = user.followings.includes(jiskoFollowkrugi);
        if(isFollowing){
            //unfollow logic aayga
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$pull:{followings:jiskoFollowkrugi}}),
                User.updateOne({_id:jiskoFollowkrugi},{$pull:{followers:followKrneWala}})
             ])
             return res.status(200).json({
                msg:"unfollowed successfully",success:true
             })

        }else{
            //follow logic aayga
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$push:{followings:jiskoFollowkrugi}}),
                User.updateOne({_id:jiskoFollowkrugi},{$push:{followers:followKrneWala}})
             ])
             return res.status(200).json({
                msg:"followed successfully",success:true
             })
        }
    } catch (e) {
        console.log(e);
    }
}