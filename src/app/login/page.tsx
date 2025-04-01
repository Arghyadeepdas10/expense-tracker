"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, signup } from "./actions";

const schema = yup
  .object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  
  const onSubmit = async (data: FormData, action: "login" | "signup") => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    try {
      if (action === "login") {
        await login(formData);
      } else {
        await signup(formData);
      }
      reset(); 
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <>
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            'url(/images/login.jpg)',
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        sx={{
          elevation: 0, 
          boxShadow: "none",
           
        }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 0 5px blue",
            padding: "1rem",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to the Expense Tracker
          </Typography>
          <Box
            component="form"
            sx={{ mt: 1, padding: "1rem" }}
            onSubmit={handleSubmit((data) => onSubmit(data, "login"))}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              
              label="Email Address"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Box
              sx={{
                display: "flex",
                gap: "20rem",
                marginTop: "1rem",
                justifyContent: "center",
              }}
            >
              {/* LOGIN Button */}
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#F59E0B",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  width: "100px",
                }}
              >
                LOGIN
              </button>
              {/* SIGNUP Button */}
              <button
                type="button"
                onClick={handleSubmit((data) => {alert("A Verfication link has been sent to your email");
                   onSubmit(data, "signup")})}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#10B981",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  width: "100px",
                }}
                
              >
                SIGNUP
              </button>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
    </>
   
  );
}
