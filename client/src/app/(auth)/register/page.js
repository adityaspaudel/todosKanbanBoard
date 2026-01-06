"use client";

import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserRegistration = () => {
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
	});
	const [fadeIn, setFadeIn] = useState(false);

	const router = useRouter();

	useEffect(() => {
		setFadeIn(true);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-400 to-gray-500 p-4">
			<div
				className={`w-full max-w-md bg-gray-900 text-white rounded-3xl shadow-2xl p-8
					transform transition-all duration-500 ease-out
					${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
					hover:scale-[1.02]`}
			>
				<h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
					Sign Up
				</h1>

				<Formik
					initialValues={formData}
					onSubmit={async (values) => {
						try {
							const response = await fetch(
								`${NEXT_PUBLIC_API_URL}/user/userRegistration`,
								{
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(values),
								}
							);
							if (!response.ok) throw new Error("Registration failed");

							const parsedData = await response.json();
							setFormData(parsedData);
							alert(parsedData.message);
							router.push("/login");
						} catch (error) {
							console.error("error occurred", error);
							alert("Registration failed. Please try again.");
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-6">
							{/* Full Name */}
							<div className="relative">
								<label
									htmlFor="fullName"
									className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
								>
									Full Name
								</label>
								<Field
									name="fullName"
									placeholder="Full Name"
									className="peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900
										focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
								/>
							</div>

							{/* Email */}
							<div className="relative">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
								>
									Email
								</label>
								<Field
									name="email"
									type="email"
									placeholder="Email"
									className="peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900
										focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
								/>
							</div>

							{/* Password */}
							<div className="relative">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
								>
									Password
								</label>
								<Field
									type="password"
									name="password"
									placeholder="Password"
									className="peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900
										focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300
									disabled:opacity-60 disabled:cursor-not-allowed"
							>
								Register
							</button>
						</Form>
					)}
				</Formik>

				<div className="text-sm text-center mt-6 text-gray-300">
					Already have an account?{" "}
					<Link href={`/login`}>
						<span className="hover:underline hover:text-indigo-400 cursor-pointer">
							Login here
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default UserRegistration;
