"use client";

import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserLogin = () => {
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-400 to-gray-500 p-4">
			<div
				className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 
							transition-transform transform hover:scale-[1.02] duration-300"
			>
				<h1 className="text-3xl font-bold text-center text-indigo-900 dark:text-indigo-300 mb-6">
					Login
				</h1>

				<Formik
					initialValues={formData}
					onSubmit={async (values) => {
						try {
							const response = await fetch(
								`${NEXT_PUBLIC_API_URL}/user/userLogin`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(values),
								}
							);

							if (!response.ok) throw new Error("Login failed");

							const parsedData = await response.json();
							setFormData(parsedData);
							router.push(`/${parsedData.user.id}`);
						} catch (error) {
							console.error("error occurred", error);
							alert("Invalid credentials. Please try again.");
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form className="space-y-5">
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
									placeholder="janedoe@acme.com"
									className="peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900
										focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
								/>
							</div>

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
									placeholder="********"
									className="peer w-full rounded-xl border border-gray-300 px-4 py-3 bg-white text-gray-900
										focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
										   text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300
										   disabled:opacity-60 disabled:cursor-not-allowed"
							>
								Login
							</button>
						</Form>
					)}
				</Formik>

				<div className="text-sm text-center mt-5 text-gray-700 dark:text-gray-300">
					Don’t have an account?{" "}
					<Link href={`/register`}>
						<span className="hover:underline hover:text-indigo-600 cursor-pointer">
							Signup here
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default UserLogin;
