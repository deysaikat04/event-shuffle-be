import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../../services/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserInterface } from "../../models/user";
import Joi from "joi";

export async function registerUserHandler(req: Request, res: Response) {
  // payload validation
  const userSchema = Joi.object({
    name: Joi.string()
      .pattern(new RegExp("^[a-zA-Z_ ]*$"))
      .min(3)
      .max(30)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  const { value: userData, error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error?.message,
    });
  }
  const { name, email, password } = userData;

  try {
    // check if user email already exists
    let userByEmail = await getUserByEmail(email);

    if (userByEmail) {
      res.status(404).json({
        message: "This email is already in use! Please use another email.",
      });
    } else {
      // create the user object with encrypted password
      const user: Partial<UserInterface> = {
        name: name.trim(),
        email: email.trim(),
        password: "",
      };
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // save the user
      let savedUser = await createUser(user);

      //   create the token
      const payload = {
        user: {
          id: savedUser.id,
        },
      };
      const SECRET = process.env.JWT_SECRET as string;
      jwt.sign(payload, SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          token,
          name,
          email,
        });
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}

export async function loginUserHandler(req: Request, res: Response) {
  // payload validation
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
  });

  const { value: userData, error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error?.message,
    });
  }

  const { email, password } = userData;

  try {
    // fetch user by email
    let userByEmail = await getUserByEmail(email);

    if (!userByEmail) {
      return res.status(400).json({
        message: "This email is not registered! Please signup to continue.",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, userByEmail.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credential! Please try again." });
    }

    // generate token
    const payload = {
      user: {
        id: userByEmail.id,
      },
    };
    const SECRET = process.env.JWT_SECRET as string;

    jwt.sign(payload, SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        name: userByEmail.name,
        email,
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error occurred! Please try again." });
  }
}
