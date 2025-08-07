import express from "express";
import User from "../Model/UserModel.js";
import jwt from "jsonwebtoken";
import generateAuthToken from "../utils/GenerateAuthToken.js";

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
} = process.env;

router.get("/google", (req, res) => {
  const scope =
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope,
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const { id_token } = await tokenRes.json();
    if (!id_token) throw new Error("Token exchange failed");

    const payload = jwt.decode(id_token);
    const { sub: oauthId, email, given_name, family_name, picture } = payload;

    let user = await User.findOne({ Email: email });
    if (!user) {
      user = await User.create({
        FirstName: given_name,
        LastName: family_name,
        Email: email,
        ProfilePicture: picture,
        oauthProvider: "google",
        oauthId,
      });
    }

    const appToken = generateAuthToken(user);

    res
      .cookie("token", appToken, {
        httpOnly: true,
        secure: true, // set to true on HTTPS production
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect(
        `${process.env.CORS_ORIGIN}/auth/google/callback?token=${appToken}`
      );
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(`${process.env.CORS_ORIGIN}/login?error=oauth_failed`);
  }
});

export default router;
